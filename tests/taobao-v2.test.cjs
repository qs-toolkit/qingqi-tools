const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const pack = JSON.parse(fs.readFileSync(path.join(root, 'packs/quietstart.taobao-taojinbi-earn/2.json'), 'utf8'));
const previous = JSON.parse(fs.readFileSync(path.join(root, 'packs/quietstart.taobao-taojinbi-earn/1.json'), 'utf8'));
const bundle = 'com.taobao.taobao4hmos';
const headers = ['今日速赚', '更多金币等你赚', '赚金币抵钱'];
// These are synthetic accessibility nodes reconstructed from the supplied
// screenshot. They are not a capture or acceptance result from that phone.
const screenshotRows = [
  ['去芭芭农场逛一逛', '浏览5秒', 30, 'browse'],
  ['搜一搜你心仪的宝贝', '浏览', 20, 'search'],
  ['去蚂蚁森林收能量', '点击去逛', 50, 'skip'],
  ['发现精选好物', '浏览', 20, 'browse'],
  ['淘金币趣味课堂', '参与答题', 30, 'skip'],
  ['浏览心仪好物', '浏览', 30, 'browse'],
  ['去支付宝红包抢现金', '点击去逛', 20, 'skip'],
  ['天天签到免费拿IP周边', '浏览最新礼盒得', 10, 'browse'],
  ['充话费0元起！', '浏览充值优惠', 10, 'skip'],
];
const plain = value => JSON.parse(JSON.stringify(value));

test('V2 retains V1 execution settings and the index selects V2 or a newer compatible revision', () => {
  assert.equal(pack.id, previous.id);
  assert.equal(pack.version, 2);
  const changes = new Set(['browseWords', 'excludeWords', 'earnedPatterns']);
  for (const key of Object.keys(previous.coinBrowse)) {
    if (!changes.has(key)) assert.deepEqual(pack.coinBrowse[key], previous.coinBrowse[key], key);
  }
  assert.equal(pack.entryAfterClick, previous.entryAfterClick);
  for (const word of previous.entryAfterClickAny) assert.ok(pack.entryAfterClickAny.includes(word));
  for (const word of previous.entryClickTexts) assert.ok(pack.entryClickTexts.includes(word));
  const index = JSON.parse(fs.readFileSync(path.join(root, 'index.json'), 'utf8'));
  const selected = index.packs.find(item => item.id === pack.id);
  assert.ok(selected.version >= 2);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, selected.url), 'utf8')).id, pack.id);
});

const sourceRoot = process.env.QUIETSTART_SOURCE_ROOT;
const sdkTs = process.env.QUIETSTART_TYPESCRIPT ||
  '/Applications/DevEco-Studio.app/Contents/tools/hvigor/hvigor-ohos-plugin/node_modules/typescript';
const available = !!sourceRoot && fs.existsSync(sdkTs);
const runtimeTest = (name, fn) => test(name,
  { skip: available ? false : 'Set QUIETSTART_SOURCE_ROOT and provide the SDK TypeScript runtime for integration checks' }, fn);
let runtime;
function api() {
  if (runtime) return runtime;
  const ts = require(sdkTs);
  function load(file, dependencies, globals = {}) {
    const exports = {};
    const source = fs.readFileSync(path.join(sourceRoot, file), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021,
    } }).outputText;
    vm.runInNewContext(code, { exports, ...globals, require(name) {
      assert.ok(Object.hasOwn(dependencies, name), name);
      return dependencies[name];
    } });
    return exports;
  }
  const core = 'entry/src/main/ets/core/';
  const worker = 'entry/src/ohosTest/ets/worker/';
  const strategy = load(core + 'DomainStrategy.ets', {});
  const codec = load(core + 'DomainPackCodec.ets', { './DomainStrategy': strategy });
  const scheduling = load(core + 'PackScheduling.ets', {});
  function bounds(value) {
    const match = /^\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]$/.exec(value || '');
    if (!match) return undefined;
    const [left, top, right, bottom] = match.slice(1).map(Number);
    return right > left && bottom > top ? { left, top, right, bottom } : undefined;
  }
  const interaction = load(worker + 'TaskPageInteraction.ets', { './SnapshotLayout': { snapshotBounds: bounds } });
  function workerFor(read, clock = { now: 10000 }) {
    const loaded = load(worker + 'CoinBrowseWorker.ets', {
      '@kit.PerformanceAnalysisKit': { hilog: { info() {} } },
      './LayoutCapture': { captureLayoutDocument: async () => ({ roots: [read()] }) },
      './SnapshotLayout': { snapshotBounds: bounds },
      './TaskPageInteraction': interaction,
    }, { Date: { now: () => clock.now }, setTimeout(fn) { fn(); return 1; } });
    return new loaded.CoinBrowseWorker();
  }
  runtime = { codec, scheduling, workerFor };
  return runtime;
}
function node(type, text, box, children = []) {
  return { attributes: { type, text, bounds: box, visible: 'true', enabled: 'true' }, children };
}
function page(rows = screenshotRows, header = '赚金币抵钱', done = false) {
  const children = [node('staticText', header, '[430,475][820,535]'),
    node('staticText', '今日累计奖励', '[50,590][500,630]'),
    node('staticText', '已领取', '[50,650][250,700]')];
  rows.forEach(([title, subtitle, reward], index) => {
    const y = 800 + index * 180;
    children.push(node('staticText', `${title}(${done ? 1 : 0}/1)`, `[250,${y}][950,${y + 48}]`),
      node('staticText', subtitle, `[250,${y + 58}][680,${y + 100}]`),
      node('staticText', '+' + reward, `[700,${y + 60}][800,${y + 100}]`),
      node('button', '去完成', `[1010,${y}][1210,${y + 90}]`));
  });
  return { attributes: { type: 'root', bundleName: bundle, visible: 'true', bounds: '[0,0][1260,2844]' },
    children: [node('rootWebArea', '', '[0,0][1260,2844]', children)] };
}

runtimeTest('V2 passes the real app compiler and JSON/text import paths', () => {
  const { codec } = api();
  assert.deepEqual(plain(codec.validateTaskSuite(pack)), []);
  for (const decoded of [codec.decodePackJson(JSON.stringify(pack)),
    codec.decodePackText(codec.encodePackJson(JSON.stringify(pack)))]) {
    assert.equal(decoded.version, 2);
    assert.equal(decoded.coinBrowse.swipeIntervalMs, 450);
    assert.ok(decoded.activationPageAlternates.includes('赚金币抵钱'));
  }
});
for (const header of headers) runtimeTest(`${header} is ready without a textual close button`, () => {
  const { codec, scheduling } = api();
  const decoded = codec.decodePackJson(JSON.stringify(pack));
  assert.equal(scheduling.packReadyForHandoff([page(screenshotRows, header)], bundle, decoded.readyWhen), true);
});
for (const header of headers.slice(0, 2)) runtimeTest(`${header} retains ordinary browsing execution`, async () => {
  const worker = api().workerFor(() => page([screenshotRows[0]], header));
  let taps = 0;
  assert.equal(await worker.tick({click: async () => taps++, swipe: async () => {}},
    bundle, pack.coinBrowse), 'task');
  assert.equal(taps, 1);
  assert.equal(worker.chosen.kind, 'browse');
});
runtimeTest('ordinary home, energy task panels and foreign app roots do not pass readiness', () => {
  const { codec, scheduling } = api();
  const ready = codec.decodePackJson(JSON.stringify(pack)).readyWhen;
  assert.equal(scheduling.packReadyForHandoff([page([], '淘金币双11狂享20亿')], bundle, ready), false);
  assert.equal(scheduling.packReadyForHandoff([page(screenshotRows, '做任务赚能量')], bundle, ready), false);
  assert.equal(scheduling.packReadyForHandoff([page()], 'com.other.app', ready), false);
});
for (const row of screenshotRows) runtimeTest(`screenshot task ${row[0]}: ${row[3]}`, async () => {
  const worker = api().workerFor(() => page([row]));
  const taps = [];
  const result = await worker.tick({ click: async (...point) => taps.push(point), swipe: async () => {} },
    bundle, pack.coinBrowse);
  if (row[3] === 'skip') {
    assert.equal(taps.length, 0);
    assert.notEqual(result, 'task');
  } else {
    assert.equal(result, 'task');
    assert.equal(taps.length, 1);
    assert.equal(worker.chosen.kind, row[3]);
    assert.equal(worker.browseDwellMs, row[1].includes('5秒') ? 5000 : 25000);
  }
  assert.equal(worker.coins(), 0, 'advertised coins and earlier claimed milestones are not new income');
});
runtimeTest('browse timing, return, progress confirmation and the next search task stay continuous', async () => {
  const clock = { now: 10000 };
  let current = page(screenshotRows.slice(0, 2));
  const worker = api().workerFor(() => current, clock);
  const driver = { click: async () => {}, swipe: async () => {} };
  assert.equal(await worker.tick(driver, bundle, pack.coinBrowse), 'task');
  current = page([], '浏览中');
  clock.now += 1000;
  assert.equal(await worker.tick(driver, bundle, pack.coinBrowse), 'browse');
  clock.now += 5000;
  assert.equal(await worker.tick(driver, bundle, pack.coinBrowse), 'back');
  current = page(screenshotRows.slice(0, 2));
  current.children[0].children.find(item => item.attributes.text.startsWith('去芭芭农场'))
    .attributes.text = '去芭芭农场逛一逛(1/1)';
  clock.now += 1000;
  assert.equal(await worker.tick(driver, bundle, pack.coinBrowse), 'verified');
  assert.equal(worker.coins(), 30);
  clock.now += 1000;
  assert.equal(await worker.tick(driver, bundle, pack.coinBrowse), 'task');
  assert.equal(worker.chosen.kind, 'search');
  assert.equal(worker.coins(), 30);
});
runtimeTest('a completed new-style panel finishes bounded sweeps instead of restarting tasks', async () => {
  const worker = api().workerFor(() => page(screenshotRows, '赚金币抵钱', true));
  let taps = 0;
  for (let i = 0; i < 25 && !worker.completed(); i++) {
    worker.nextReadAt = 0;
    await worker.tick({ click: async () => taps++, swipe: async () => {} }, bundle, pack.coinBrowse);
  }
  assert.equal(worker.completed(), true, JSON.stringify({phase: worker.phase,
    swipes: worker.panelSwipes, stalls: worker.panelStalls, result: worker.result()}));
  assert.equal(taps, 0);
});
runtimeTest('earned-number patterns recognize one or many digits without requiring a literal slash', () => {
  for (const text of ['已得2', '已得20', '已得金币300']) {
    assert.ok(pack.coinBrowse.earnedPatterns.some(pattern => new RegExp(pattern).test(text)), text);
  }
  assert.equal(pack.coinBrowse.earnedPatterns.some(pattern => new RegExp(pattern).test('已得0')), false);
});

runtimeTest('coin V3 enables a bounded speed range and otherwise retains all V2 execution settings', () => {
  const updated = JSON.parse(fs.readFileSync(path.join(root, 'packs/quietstart.taobao-taojinbi-earn/3.json'), 'utf8'));
  assert.deepEqual(updated.coinBrowse.swipeSpeedRange, [250,450]);
  for (const key of Object.keys(pack.coinBrowse)) assert.deepEqual(updated.coinBrowse[key], pack.coinBrowse[key], key);
  assert.deepEqual(plain(api().codec.validateTaskSuite(updated)), []);
});
runtimeTest('energy V2 compiles its own entry, 查看 browsing, safe completion and energy unit', () => {
  const updated = JSON.parse(fs.readFileSync(path.join(root, 'packs/quietstart.taobao-taojinbi-energy/2.json'), 'utf8'));
  assert.deepEqual(plain(api().codec.validateTaskSuite(updated)), []);
  const decoded = api().codec.decodePackText(api().codec.encodePackJson(JSON.stringify(updated)));
  assert.equal(decoded.activationPageText, '做任务赚能量');
  assert.deepEqual(plain(decoded.activationClickTexts), ['赚能量','去赚能量']);
  assert.equal(decoded.coinBrowse.rewardUnit, '能量');
  assert.equal(decoded.coinBrowse.panelProgressText, '当前进度');
  assert.ok(decoded.coinBrowse.browseWords.includes('查看'));
  assert.equal(decoded.coinBrowse.browseDwellMs, 25000);
  assert.equal(decoded.coinBrowse.searchQuery, '衣服');
  assert.equal(decoded.coinBrowse.earnedTexts.includes('已得'), false, 'mixed page earnings cannot confirm energy');
  assert.equal(api().scheduling.packReadyForHandoff([page([], '做任务赚能量')], bundle, decoded.readyWhen), true);
  assert.equal(api().scheduling.packReadyForHandoff([page([], '今日速赚')], bundle, decoded.readyWhen), false);
});

for (const [id, version] of [['earn',4],['energy',3]]) test(`current ${id} widens random browse range`, () => {
  const doc = JSON.parse(fs.readFileSync(path.join(__dirname, `../packs/quietstart.taobao-taojinbi-${id}/${version}.json`), 'utf8'));
  assert.deepEqual(doc.coinBrowse.swipeSpeedRange, [200,800]);
  assert.equal(doc.coinBrowse.swipeIntervalMs, 450);
  assert.ok(doc.usage.includes('127061'));
});
