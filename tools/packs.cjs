#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const indexFile = path.join(root, 'index.json');
const packsDir = path.join(root, 'packs');
const validId = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function fail(message) {
  throw new Error(message);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${file}: ${error.message}`);
  }
}

function assertPack(pack, file) {
  if (!pack || typeof pack !== 'object' || Array.isArray(pack)) fail(`${file}: 工具包必须是 JSON 对象`);
  if (!Number.isInteger(pack.schema) || pack.schema < 1) fail(`${file}: schema 无效`);
  if (typeof pack.id !== 'string' || !validId.test(pack.id)) fail(`${file}: id 无效`);
  if (typeof pack.name !== 'string' || !pack.name.trim()) fail(`${file}: name 不能为空`);
  if (!Number.isSafeInteger(pack.version) || pack.version < 1) fail(`${file}: version 无效`);
  return pack;
}

function packUrl(pack) {
  return `packs/${pack.id}/${pack.version}.json`;
}

function readIndex() {
  const index = readJson(indexFile);
  if (!index || index.schema !== 1 || typeof index.name !== 'string' || !Array.isArray(index.packs)) {
    fail(`${indexFile}: 清单格式无效`);
  }
  return index;
}

function check() {
  const index = readIndex();
  const versions = new Map();
  for (const id of fs.readdirSync(packsDir)) {
    const directory = path.join(packsDir, id);
    if (!fs.statSync(directory).isDirectory()) fail(`${directory}: 只允许工具包目录`);
    if (!validId.test(id)) fail(`${directory}: 目录名无效`);
    for (const filename of fs.readdirSync(directory)) {
      if (!/^[1-9][0-9]*\.json$/.test(filename)) fail(`${directory}/${filename}: 文件名应为版本号.json`);
      const file = path.join(directory, filename);
      if (!fs.statSync(file).isFile()) fail(`${file}: 不是普通文件`);
      const pack = assertPack(readJson(file), file);
      if (pack.id !== id || `${pack.version}.json` !== filename) fail(`${file}: id 或 version 与路径不一致`);
      if (!versions.has(id)) versions.set(id, new Map());
      versions.get(id).set(pack.version, pack);
    }
  }
  let previousId = '';
  for (const entry of index.packs) {
    if (!entry || typeof entry !== 'object' || !validId.test(entry.id || '')) fail('清单中有无效 id');
    if (entry.id <= previousId) fail(`清单 id 重复或未按字母排序：${entry.id}`);
    previousId = entry.id;
    const pack = versions.get(entry.id)?.get(entry.version);
    if (!pack) fail(`清单中的工具包文件不存在：${entry.id}`);
    if (entry.name !== pack.name || entry.version !== pack.version || entry.url !== packUrl(pack)) {
      fail(`清单与所选版本的工具包不一致：${entry.id}`);
    }
    versions.delete(entry.id);
  }
  if (versions.size) fail(`工具包尚未加入清单：${[...versions.keys()].join(', ')}`);
  console.log(`校验通过：${index.packs.length} 个工具包，版本文件和清单一致`);
  return index;
}

function add(source) {
  if (!source) fail('用法：node tools/packs.cjs add <工具包.json>');
  const index = check();
  const sourceFile = path.resolve(source);
  const pack = assertPack(readJson(sourceFile), sourceFile);
  const existing = index.packs.find(entry => entry.id === pack.id);
  if (existing && pack.version < existing.version) fail(`版本不能回退：${pack.id} 当前为 ${existing.version}`);
  const destination = path.join(root, packUrl(pack));
  let created = false;
  if (fs.existsSync(destination)) {
    if (JSON.stringify(readJson(destination)) !== JSON.stringify(pack)) {
      fail(`版本文件已存在且内容不同；请先递增 version：${packUrl(pack)}`);
    }
    if (existing?.version === pack.version) {
      console.log(`已经存在，未修改：${packUrl(pack)}`);
      return;
    }
  } else {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, `${JSON.stringify(pack, null, 2)}\n`, { flag: 'wx' });
    created = true;
  }
  const entry = { id: pack.id, name: pack.name, version: pack.version, url: packUrl(pack) };
  index.packs = [...index.packs.filter(item => item.id !== pack.id), entry]
    .sort((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  const temporary = `${indexFile}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(index, null, 2)}\n`, { flag: 'wx' });
    fs.renameSync(temporary, indexFile);
  } catch (error) {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    if (created) fs.unlinkSync(destination);
    throw error;
  }
  check();
  console.log(`已加入：${packUrl(pack)}`);
}

try {
  const [, , command, source] = process.argv;
  if (command === 'check') check();
  else if (command === 'add') add(source);
  else if (command === 'help' || command === '--help' || !command) {
    console.log('用法：node tools/packs.cjs check | add <工具包.json>');
  } else fail(`未知命令：${command}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
