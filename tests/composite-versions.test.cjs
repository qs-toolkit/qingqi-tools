const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const singles=read('index.json'),ledger=read('collections/composite/v1/VERSIONS.json');
const payload=p=>new Map(read(p).files.map(f=>[f.path,f.text]));
for(const channel of ledger.channels){
 test(channel+' initial versions follow the single-config index +1 and content revisions increase monotonically',()=>{
  assert.equal(ledger.strategy,'single-config-current-index-plus-one');const index=read(channel+'/index.json');assert.equal(index.packs.length,14);
  for(const pack of index.packs){
   const single=singles.packs.find(p=>p.id===pack.id),row=ledger.packs.find(p=>p.id===pack.id);assert.ok(single&&row,pack.id);
   const release=pack.releases[0];assert.equal(release.version,single.version+1+(row.revision??0),pack.id);assert.equal(release.version,row.version);assert.equal(row.baselineVersion,single.version);
   assert.equal(release.url,'packs/'+pack.id+'/'+release.version+'.json');
  }
 });
 test(channel+' preserves configuration and compatibility across recorded content revisions',()=>{
  const index=read(channel+'/index.json');for(const pack of index.packs){
   const release=pack.releases[0],next=payload(channel+'/'+release.url),previous=payload(channel+'/packs/'+pack.id+'/1.json');assert.deepEqual([...next.keys()],[...previous.keys()]);
   for(const [name,text]of next){
    if(['files.json','signature.json'].includes(name))continue;
    if(['manifest.json','rules.json'].includes(name)){const a=JSON.parse(text),b=JSON.parse(previous.get(name));assert.equal(a.version,release.version);a.version=b.version;assert.deepEqual(a,b,pack.id+'/'+name);}
    else if(name==='main.mjs'&&(ledger.packs.find(p=>p.id===pack.id).revision??0)>0) assert.equal(crypto.createHash('sha256').update(text).digest('hex'),ledger.packs.find(p=>p.id===pack.id).scriptSha256,'approved script revision');
    else assert.equal(text,previous.get(name),pack.id+'/'+name);
   }
   const a=JSON.parse(next.get('signature.json')),b=JSON.parse(previous.get('signature.json'));assert.equal(a.publicKey,b.publicKey);assert.equal(a.keyId,b.keyId);
  }
 });
}
