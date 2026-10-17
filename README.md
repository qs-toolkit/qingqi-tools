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
- `packs/<id>/<version>.json`：每个版本的包正文，由 `tools/tool-pack-index.cjs` 生成。
- 更新：改包 → 递增 `version` → 重新生成（不带 `--base`）→ 提交并推送；订阅地址不变。
- Pages：仓库 Settings → Pages → Deploy from a branch → `main` / `(root)`。
