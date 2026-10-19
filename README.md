# 轻启工具包订阅

订阅地址（在轻启「工具包 → 导入 → 订阅链接」里粘贴）：

```
https://ghproxy.net/https://raw.githubusercontent.com/qs-toolkit/qingqi-tools/main/index.json
```

直连备用：

```
https://qs-toolkit.github.io/qingqi-tools/index.json
```

- `index.json`：清单，列出包标识、版本与各自的地址（相对地址，镜像会一起解析）。
- `packs/<id>/<version>.json`：每个版本的包正文；已发布版本不覆盖。
- `tools/packs.cjs`：本仓库独立的清单校验与版本导入脚本，无需进入轻启本体工程。

版本要求：QQ 音乐免会员视频任务 v3 需要轻启 **127037 或更新版本**，使用新增的落地页返回策略和连续广告衔接能力。请先更新轻启，再更新该工具包；订阅工具包不会更新轻启本体。

本地维护：

```sh
node tools/packs.cjs check
node tools/packs.cjs add /path/to/updated.task.json
git diff --check
git diff -- index.json
```

修改工具包后递增顶层 `version`，再执行 `add`。脚本会保存新版本、更新 `index.json` 并检查清单与文件一致；重复导入相同内容不会修改文件。它只检查发布结构和元数据；实际执行兼容性仍需在轻启中验证。确认后再提交并推送到 `main`，订阅地址不变。
- Pages：仓库 Settings → Pages → Deploy from a branch → `main` / `(root)`。
