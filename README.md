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
- `packs/<id>/<version>.json`：每个版本的包正文；正常更新保留已发布版本，清单明确选择当前分发的版本。
- `tools/packs.cjs`：本仓库独立的清单校验与版本导入脚本，无需进入轻启本体工程。

版本要求：QQ 音乐免会员视频任务 v3 需要轻启 **127037 或更新版本**，使用新增的落地页返回策略和连续广告衔接能力。请先更新轻启，再更新该工具包；订阅工具包不会更新轻启本体。

起点手动验证版（2026-10-20）：按维护者指定覆盖发布为 **v9**，包含原 v11 的持续执行调整，以及缩短、加快的返回手势。v10/v11 用户需手动重新导入 [v9 JSON](packs/quietstart.qidian-welfare-center/9.json)，订阅不会自动降级。目录中的 v10/v11 文件保留作历史记录。

淘宝淘金币赚金币任务升级为 **v2**：兼容「今日速赚」「更多金币等你赚」及双11「赚金币抵钱」面板，支持浏览、搜索、农场及明确要求浏览的每日 IP 礼盒任务；继续跳过答题、邀请、支付、充值、兑换和蚂蚁森林等外部应用任务。请使用轻启 **1.2.7(127058) 或更新版本**，无需更换轻启安装包。v1 用户可通过工具包统一更新升级；v21/v22 测试包需手动重新导入 [v2 JSON](packs/quietstart.taobao-taojinbi-earn/2.json)，订阅不会自动降级。活动样式的兼容依据用户截图与离线回归，尚未取得该样式的实机控件树验收。

淘宝淘金币赚能量任务 **v1**（本地新增，未推送）：由赚金币 v2 派生，入口和恢复入口为「赚能量／去赚能量」，面板标识为「做任务赚能量」；在原有浏览条件上增加主标题「查看」，仍要求副标题明确描述浏览。默认搜索衣服、页面时长优先、25 秒兜底、慢滑及短促边缘返回均沿用原配置。[v1 JSON](packs/quietstart.taobao-taojinbi-energy/1.json) 已通过现有引擎的导入、页面范围与任务匹配离线检查，尚未实机验证。当前同应用不同入口的独立工具包应择一启用，运行赚能量前先暂停赚金币包。本版仅修改工具包配置，胶囊仍沿用原奖励文案，能量数量以淘宝任务页面为准。

本地维护：

```sh
node tools/packs.cjs check
node tools/packs.cjs add /path/to/updated.task.json
git diff --check
git diff -- index.json
```

修改工具包后递增顶层 `version`，再执行 `add`。脚本会保存新版本、更新 `index.json` 并检查清单与文件一致；重复导入相同内容不会修改文件。它只检查发布结构和元数据；实际执行兼容性仍需在轻启中验证。确认后再提交并推送到 `main`，订阅地址不变。

淘金币 V2 兼容回归可配合轻启源码和 DevEco Studio SDK 运行：

```sh
QUIETSTART_SOURCE_ROOT=/path/to/quietstart node --test tests/taobao-v2.test.cjs
```

测试中的活动页面为根据用户截图构造的离线控件夹具，包含入口、任务筛选、浏览计时、返回、进度确认及完成后停止场景，不代表该用户设备的实机验收。

- Pages：仓库 Settings → Pages → Deploy from a branch → `main` / `(root)`。
