const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pack=read('packs/quietstart.wechat-assist/1.json');
test('green bubble helper is published under a compatible engine requirement',()=>{
 assert.equal(pack.name,'绿泡泡辅助');assert.equal(pack.version,1);assert.equal(pack.minAppVersionCode,129001);
 const item=read('index.json').packs.find(p=>p.id===pack.id);assert.equal(item.name,pack.name);assert.equal(item.version,1);
});
test('native bindings preserve user sending and expose sender scope choices',()=>{
 const app=pack.feedFilter.apps[0],groups=app.ruleGroups;
 assert.equal(app.name,'绿泡泡辅助');assert.ok(pack.usage.includes('发送图片仍由用户操作'));
 assert.deepEqual(groups.find(g=>g.key==='voice-to-text').choices.map(c=>c.key),['off','peer','self','both']);
 assert.ok(groups.find(g=>g.key==='original-image'));
});
