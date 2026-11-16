const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const payload=p=>Object.fromEntries(read(p).files.map(f=>[f.path,f.text]));
const id='quietstart.qishui-membership-rewards';
for(const channel of ['collections/composite/v1','collections/composite/v1/latest']){
 test(channel+' Qishui V5 preserves identity, configuration and input declarations while admitting the exact public-service badge',()=>{
  const release=read(channel+'/index.json').packs.find(p=>p.id===id).releases[0];assert.equal(release.version,5);
  assert.deepEqual(read(channel+'/index-130047.json').packs.find(p=>p.id===id).releases[0],release,
    'newer-client catalog must expose the same V5 update');
  const text=fs.readFileSync(path.join(root,channel,release.url),'utf8');
  assert.equal(crypto.createHash('sha256').update(text).digest('hex'),release.sha256);
  const before=payload(channel+'/packs/'+id+'/4.json'),after=payload(channel+'/'+release.url);
  for(const name of ['policy.json','config.json','migrate.mjs'])assert.equal(after[name],before[name],name);
  for(const name of ['manifest.json','rules.json']){
   const a=JSON.parse(after[name]),b=JSON.parse(before[name]);assert.equal(a.version,5);a.version=4;assert.deepEqual(a,b);
  }
  const old='    return text.startsWith(badge) && text.length <= badge.length + 4;';
  const updated=`    // Public-service reward videos use this exact badge in the same
    // declared ad crop. Keep completion, countdown and fresh input checks.
    return text === '公益' || text.startsWith(badge) && text.length <= badge.length + 4;`;
  assert.equal(before['main.mjs'].split(old).length,2);assert.equal(after['main.mjs'],before['main.mjs'].replace(old,updated));
  const previousSignature=JSON.parse(before['signature.json']),signature=JSON.parse(after['signature.json']);
  assert.equal(signature.publicKey,previousSignature.publicKey);assert.equal(signature.keyId,previousSignature.keyId);
  assert.ok(crypto.verify('sha256',Buffer.from('quietstart-toolkit/v1\n'+after['files.json']),
    crypto.createPublicKey({key:Buffer.from(signature.publicKey,'base64'),type:'spki',format:'der'}),Buffer.from(signature.signature,'base64')));
  const ledger=read('collections/composite/v1/VERSIONS.json').packs.find(p=>p.id===id);
  assert.equal(ledger.version,5);assert.equal(ledger.revision,1);
  assert.equal(ledger.scriptSha256,crypto.createHash('sha256').update(after['main.mjs']).digest('hex'));
 });
}
