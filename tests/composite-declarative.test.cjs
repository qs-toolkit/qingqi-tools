const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), os = require('node:os'), path = require('node:path'), crypto = require('node:crypto');
const { checkCollection } = require('../tools/composite.cjs');
const base = path.resolve(__dirname, '../collections/composite/v1');
const source = JSON.parse(fs.readFileSync(path.join(base, 'packs/quietstart.splash-ad/1.json'), 'utf8'));
const entry = JSON.parse(fs.readFileSync(path.join(base, 'index.json'), 'utf8')).packs.find(p => p.id === 'quietstart.splash-ad');
function fixture(t, edit) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'quietstart-collection-'));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));
  const envelope = structuredClone(source), pack = structuredClone(entry);
  edit?.(envelope, pack);
  const text = JSON.stringify(envelope);
  pack.releases[0].sha256 = crypto.createHash('sha256').update(text).digest('hex');
  const file = path.join(folder, pack.releases[0].url);
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text);
  fs.writeFileSync(path.join(folder, 'index.json'), JSON.stringify({ schema: 2, packs: [pack] }));
  return folder;
}
test('signed declarative package is admitted without placeholder JavaScript', t => {
  assert.equal(source.files.some(f => f.path.endsWith('.mjs')), false);
  assert.equal(checkCollection(fixture(t)).packages, 1);
  assert.equal(checkCollection(base).packages, 15);
  assert.equal(checkCollection(path.join(base, 'latest')).packages, 15);
});
test('changed rule bytes fail even when outer collection digest is updated', t => {
  const folder = fixture(t, envelope => { envelope.files.find(f => f.path === 'rules.json').text += ' '; });
  assert.throws(() => checkCollection(folder), /signed-payload-digest-mismatch/);
});
test('declarative carrier rejects undeclared script payloads and entry points', t => {
  const extra = fixture(t, envelope => { envelope.files.push({ path: 'main.mjs', text: 'export function onEvent(){}' }); });
  assert.throws(() => checkCollection(extra), /unexpected-payload-set/);
  const entry = fixture(t, envelope => {
    const row = envelope.files.find(f => f.path === 'manifest.json'), manifest = JSON.parse(row.text);
    manifest.entries.script = 'main.mjs'; row.text = JSON.stringify(manifest);
  });
  assert.throws(() => checkCollection(entry), /invalid-declarative-entries/);
});

test('declared selector-policy script has a real signed payload and a compatible host floor', t => {
 const file=path.join(base,'packs/quietstart.wechat-assist/1.json'), pack=JSON.parse(fs.readFileSync(path.join(base,'index.json'))).packs.find(p=>p.id==='quietstart.wechat-assist');
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'quietstart-policy-'));t.after(()=>fs.rmSync(folder,{recursive:true,force:true}));
 fs.mkdirSync(path.dirname(path.join(folder,pack.releases[0].url)),{recursive:true});fs.copyFileSync(file,path.join(folder,pack.releases[0].url));fs.writeFileSync(path.join(folder,'index.json'),JSON.stringify({schema:2,packs:[pack]}));assert.equal(checkCollection(folder).packages,1);
 for(const change of [m=>m.minAppVersionCode=129530,m=>m.requires.features=m.requires.features.filter(f=>f!=='rules.policy-script.v1')]){
  const e=JSON.parse(fs.readFileSync(file)),m=e.files.find(f=>f.path==='manifest.json');const d=JSON.parse(m.text);change(d);m.text=JSON.stringify(d);const text=JSON.stringify(e);fs.writeFileSync(path.join(folder,pack.releases[0].url),text);pack.releases[0].sha256=crypto.createHash('sha256').update(text).digest('hex');fs.writeFileSync(path.join(folder,'index.json'),JSON.stringify({schema:2,packs:[pack]}));assert.throws(()=>checkCollection(folder),/invalid-declarative-policy/);
 }
});

test('single press primitive declares its compatible engine feature and floor',t=>{
 const file=path.join(base,'packs/quietstart.wechat-assist/1.json'),pack=JSON.parse(fs.readFileSync(path.join(base,'index.json'))).packs.find(p=>p.id==='quietstart.wechat-assist');
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'quietstart-press-'));t.after(()=>fs.rmSync(folder,{recursive:true,force:true}));fs.mkdirSync(path.dirname(path.join(folder,pack.releases[0].url)),{recursive:true});
 for(const change of [m=>m.minAppVersionCode=129534,m=>m.requires.features=m.requires.features.filter(f=>f!=='rules.long-press-duration.v1')]){
 const e=JSON.parse(fs.readFileSync(file)),m=e.files.find(f=>f.path==='manifest.json'),d=JSON.parse(m.text);change(d);m.text=JSON.stringify(d);const text=JSON.stringify(e);fs.writeFileSync(path.join(folder,pack.releases[0].url),text);pack.releases[0].sha256=crypto.createHash('sha256').update(text).digest('hex');fs.writeFileSync(path.join(folder,'index.json'),JSON.stringify({schema:2,packs:[pack]}));assert.throws(()=>checkCollection(folder),/invalid-declarative-press/);
 }
});
