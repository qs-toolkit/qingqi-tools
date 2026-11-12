#!/usr/bin/env node
// Portable repository checks. This never executes toolkit JavaScript, grants
// device trust, or replaces the importing application's own signature checks.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const canonical = v => v === null || typeof v !== 'object' ? JSON.stringify(v) : Array.isArray(v) ? '[' + v.map(canonical).join(',') + ']' : '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
const ensure = (condition, message) => { if (!condition) throw Error(message); };
function checkCollection(directory) {
  const index = JSON.parse(fs.readFileSync(path.join(directory, 'index.json'), 'utf8'));
  ensure(index.schema === 2 && Array.isArray(index.packs) && index.packs.length > 0 && index.packs.length <= 32, 'invalid-collection-index');
  let total = 0; const ids = new Set(), publishers = new Set();
  for (const pack of index.packs) {
    ensure(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(pack.id) && !ids.has(pack.id), 'invalid-or-duplicate-package'); ids.add(pack.id);
    ensure(Array.isArray(pack.releases) && pack.releases.length > 0 && pack.releases.length <= 32, 'invalid-release-count');
    const versions = new Set();
    for (const release of pack.releases) {
      ensure(++total <= 128 && Number.isSafeInteger(release.version) && release.version > 0 && !versions.has(release.version), 'invalid-or-duplicate-version'); versions.add(release.version);
      ensure(release.url === 'packs/' + pack.id + '/' + release.version + '.json', 'release-path-must-be-immutable-and-local');
      const text = fs.readFileSync(path.join(directory, release.url), 'utf8');
      ensure(/^[0-9a-f]{64}$/.test(release.sha256) && sha(text) === release.sha256, 'release-sha256-mismatch');
      const envelope = JSON.parse(text), files = new Map();
      ensure(envelope.schema === 5 && envelope.kind === 'quietstart-toolkit-text' && Array.isArray(envelope.files), 'signed-carrier-required');
      for (const file of envelope.files) { ensure(file && typeof file.path === 'string' && typeof file.text === 'string' && !files.has(file.path), 'duplicate-payload'); files.set(file.path, file.text); }
      const list = files.get('files.json'), signature = JSON.parse(files.get('signature.json'));
      const manifest = JSON.parse(files.get('manifest.json'));
      const declarative = manifest.profile === 'declarative-task/1';
      const rows = JSON.parse(list), expected = declarative ? ['LICENSES.txt', 'manifest.json', 'rules.json'] :
        ['LICENSES.txt', 'main.mjs', 'manifest.json', 'migrate.mjs', 'policy.json', 'rules.json'];
      if (files.has('config.json')) expected.push('config.json'); expected.sort();
      if (declarative) ensure(manifest.entries.rules === 'rules.json' &&
        Object.keys(manifest.entries).sort().join('|') === (files.has('config.json') ? 'config|rules' : 'rules'), 'invalid-declarative-entries');
      ensure(files.size === expected.length + 2 && Array.isArray(rows) && rows.length === expected.length, 'unexpected-payload-set');
      for (const [i, row] of rows.entries()) {
        ensure(row.path === expected[i] && files.has(row.path), 'invalid-signed-file-order'); const payload = files.get(row.path);
        ensure(row.bytes === Buffer.byteLength(payload) && row.sha256 === sha(payload), 'signed-payload-digest-mismatch');
      }
      const der = Buffer.from(signature.publicKey, 'base64'), publicKey = crypto.createPublicKey({ key: der, type: 'spki', format: 'der' });
      ensure(signature.algorithm === 'ECDSA-P256-SHA256' && publicKey.asymmetricKeyType === 'ec' && publicKey.asymmetricKeyDetails?.namedCurve === 'prime256v1' &&
        crypto.verify('sha256', Buffer.from('quietstart-toolkit/v1\n' + list), publicKey, Buffer.from(signature.signature, 'base64')), 'invalid-publisher-signature');
      publishers.add(sha(der));
      const rules = JSON.parse(files.get('rules.json'));
      ensure(manifest.id === pack.id && manifest.version === release.version && rules.id === pack.id && rules.version === release.version && manifest.publisher.keyId === signature.keyId, 'release-identity-mismatch');
      ensure(manifest.minAppVersionCode === release.minAppVersionCode && manifest.maxAppVersionCode === release.maxAppVersionCode && canonical(manifest.requires) === canonical(release.requires), 'release-compatibility-mismatch');
      if (files.has('config.json')) {
        const config = JSON.parse(files.get('config.json'));
        ensure(config.schema === 1 && config.fields.length > 0 && config.fields.length <= 32 && manifest.minAppVersionCode >= 129121 && manifest.entries.config === 'config.json' && manifest.requires.features.includes('config.v1'), 'invalid-config-admission');
      }
    }
  }
  return { packages: ids.size, releases: total, publisherFingerprints: [...publishers] };
}
module.exports = { checkCollection };
if (require.main === module) {
  if (process.argv[2] && process.argv[2] !== 'check') throw Error('Usage: node tools/composite.cjs check [COLLECTION_DIRECTORY]');
  const directory = process.argv[3] || path.resolve(__dirname, '../collections/composite');
  console.log(JSON.stringify(checkCollection(directory), null, 2));
}
