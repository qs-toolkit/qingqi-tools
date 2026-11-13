const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
test('legacy directory is byte-identical while modern clients discover the composite channel',()=>{
 const old=fs.readFileSync(path.join(root,'index.json'));assert.equal(crypto.createHash('sha256').update(old).digest('hex'),'cba28ef2c5352c93b5c5e4776f784783d30a71d26efca09d1cfb2937a9731775');
 const c=JSON.parse(fs.readFileSync(path.join(root,'index.channels.json')));assert.equal(c.schema,1);assert.equal(c.kind,'quietstart-toolkit-channels');assert.deepEqual(c.channels,[{minAppVersionCode:130004,url:'collections/composite/v1/index.json'}]);
 const next=JSON.parse(fs.readFileSync(path.join(root,c.channels[0].url)));assert.equal(next.schema,2);assert.equal(next.packs.length,14);
});
