const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const coin=read('packs/quietstart.qqmusic-coin-center/4.json'),member=read('packs/quietstart.qqmusic-free-listen-video/5.json');
test('coin subscription returns one actual toolkit and archives its former companions',()=>{
 const index=read('index.json');assert.equal(Array.isArray(read('bundles/qqmusic-coin-center/1.json')),false);
 assert.equal(index.packs.filter(p=>p.id.startsWith('quietstart.qqmusic-coin-center')).length,1);
 assert.equal(index.retiredPacks.filter(p=>p.replacedBy===coin.id).length,5);
 assert.equal(coin.minAppVersionCode,128184);
});
test('the business order is gifts, timed work, then videos with safe resume checkpoints',()=>{
 const task=s=>coin.tasks.find(t=>t.id==='quietstart.qqmusic-coin-center-'+s);
 assert.ok(task('gift-cycle').priority<task('timer').priority);
 assert.ok(task('timer').priority<task('chest').priority);
 assert.ok(task('chest').priority<task('video-start').priority);
 assert.ok(coin.taskSchedule.checkpoints.some(p=>p.taskId===task('video-cycle').id&&p.beforeStep===3));
 assert.equal(task('video-cycle').steps[1].do.capability,'click');
 assert.ok(task('video-cycle').steps[1].need.visibleText.some(s=>s.includes('获得奖励')));
});
test('chest visits last three seconds and repeat only with confirmed coin growth',()=>{
 const bindings=coin.taskLandingVisits.filter(p=>/chest$|daily-native-2$|daily-detail-2$/.test(p.taskId));
 assert.equal(bindings.length,2);assert.ok(bindings.every(p=>p.visit.dwellMs===3000));
 const chest=bindings.find(p=>p.taskId.endsWith('chest')).visit;
 assert.deepEqual(chest.repeatWhileRewardIncreases.readyTexts,['观看广告']);
 assert.equal(chest.followUpVisit.dwellMs,3000);
 assert.ok(!coin.tasks.some(t=>/daily-native-[12]$/.test(t.id)));
 assert.equal(new RegExp(chest.repeatWhileRewardIncreases.progressPattern).exec('金币收益：321金币')[1],'321');
 const timed=coin.taskSchedule.groups.find(p=>p.id==='chest');
 assert.equal(timed.intervalMs,300000);assert.ok(timed.availability);
 assert.ok(coin.taskSchedule.groups.every(p=>p.intervalMs===300000&&p.availability?.readySiblingText));
 assert.ok(!coin.tasks.some(p=>p.id.endsWith('daily-checkpoint')));
});
test('member and coin entrances stay distinct and require the compatible engine',()=>{
 assert.equal(member.minAppVersionCode,128184);assert.deepEqual(member.entryClickTexts,['免','加时长']);
 assert.notEqual(member.entryAfterClick,coin.entryAfterClick);
 assert.ok(!coin.entryAfterClickAny?.includes('点击后看'));
 assert.equal(member.landingVisit.dwellMs,5000);
});
