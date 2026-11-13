# 综合工具包参数清单与更新规则

核对日期：2026-11-13。范围为综合仓 collections/composite/v1/index.json 的全部 14 项；本次发布在原 89 个参数上增加 9 项，合计 98 项。历史顶层包不混入本清单。

发布基线：7010598779421c9792cdcacb83c1da034edf9dc4。逐包校验索引摘要和原发布者签名；普通版和新版轻启版均以原 V1 路径发布，保留各自已有执行优化。来源标记、恢复默认按钮需要轻启 129529。

## 默认与手动

每个参数左侧显示“默认”或“手动”。默认项没有覆盖记录，工具包更新后读取新默认值；手动项按工具包 ID、发布者指纹和稳定参数键保存，更新不覆盖，包括手动输入恰好等于旧默认值的情况。保存仅写入改动项，新增参数先按默认值。逐项或整页恢复默认并保存后，移除对应覆盖，后续重新跟随包更新。

类型或范围不兼容时保留原手动值并提示调整，执行不会静默改用新默认值；移除的参数保留为旧项。不同发布者不共享个人参数。

## 本轮补齐

- 开屏 V7：自动暂停开关、连续未点击次数（默认 3）、最少跨度（默认 1 小时，1～168 小时）、暂停后复查间隔（默认 7 天）。配置归工具包；全局设置入口移除。无需页面可读、完整观察或广告线索，同一次访问只计一次。
- 音乐、影视、云盘安装任务：直接配置打开应用后停留时长（1～600 秒），默认分别为 12、5、5 秒。
- 主题任务：分别配置安装后打开和直接打开的停留时长（1～600 秒），默认沿用原包。
- 旧“额外停留”兼容保留并叠加，避免升级改变已有手动设置；总停留＝本次基础时长＋旧额外时长。缩短停留不保证满足目标应用奖励条件，仍走原奖励确认流程。

## 酷狗概念版每日签到（kugou-concept-daily-checkin）

已发布 V1：2 项（此前 2 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |

## 云盘免费领50GB安装任务（quietstart.cloud-space-50gb-install）

已发布 V1：7 项（此前 6 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 活动页累计打开目标 | install.targetBalance | 30 | 1～100 个 | 活动目标 |
| 无任务时最多换一换次数 | install.maxRefreshes | 3 | 0～3  | 安装兼容设置；高级 |
| 额外停留（毫秒） | install.extraDwellMs | 0 | 0～10000  | 安装兼容设置；高级 |
| 领奖后卸载本轮新装应用 | install.cleanupInstalled | true | 开启／关闭 | 任务完成后 |
| 打开应用后停留时长 | install.dwellSeconds | 5 | 1～600 秒 | 打开应用与停留 |

## 鸿蒙星空小助手（quietstart.harmony-star-assistant）

已发布 V1：11 项（此前 11 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 运行模式 | activityMode | default | 常规、只种菜、只偷菜 | 运行模式 |
| 好友巡访间隔（秒） | friendSeconds | 90 | 10～3600 秒 | 好友巡访；[{"key":"activityMode","values":["default","steal-only"]}] |
| 等待时显示屏保 | screenSaver | true | 开启／关闭 | 助手显示 |
| 屏保速度 | screenSaverSpeed | standard | 慢速、标准、快速 | 助手显示；[{"key":"screenSaver","values":[true]}] |
| 常规模式自动偷菜 | autoSteal | true | 开启／关闭 | 好友巡访；[{"key":"activityMode","values":["default"]}] |
| 自动施肥 | autoFertilize | false | 开启／关闭 | 自家种植；[{"key":"activityMode","values":["default","plant-only"]}] |
| 种植顺序 | planting | old-first | 优先已有花种、优先新花种 | 自家种植；[{"key":"activityMode","values":["default","plant-only"]}] |
| 任务优先顺序 | priority | steal-first | 先处理自家、先巡访好友 | 好友巡访；[{"key":"activityMode","values":["default"]},{"key":"autoSteal","values":[true]}] |
| 前台助手显示田地 | showPlots | true | 开启／关闭 | 助手显示 |
| 前台助手显示订单 | showOrders | true | 开启／关闭 | 助手显示 |
| 前台助手显示图鉴 | showAtlas | true | 开启／关闭 | 助手显示 |

## 金铲铲助手（quietstart.jcc-assistant）

已发布 V1：3 项（此前 3 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 深色助手页面 | darkTheme | false | 开启／关闭 | 页面显示；高级 |
| 阵容库每页条数 | libraryPageSize | 12 | 4～12  | 页面显示；高级 |
| 下次沿用最近选择的阵容 | rememberLastLineup | false | 开启／关闭 | 进游戏时 |

## 视频免会员安装任务（quietstart.movie-free-member-install）

已发布 V1：8 项（此前 7 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 本轮最多安装几个应用 | install.maxTasks | 13 | 1～13 个 | 本轮目标 |
| 钱包金币总额目标 | install.targetBalance | 1000 | 1～1000 金币 | 本轮目标 |
| 无任务时最多换一换次数 | install.maxRefreshes | 3 | 0～3  | 安装兼容设置；高级 |
| 额外停留（毫秒） | install.extraDwellMs | 0 | 0～10000  | 安装兼容设置；高级 |
| 领奖后卸载本轮新装应用 | install.cleanupInstalled | true | 开启／关闭 | 任务完成后 |
| 打开应用后停留时长 | install.dwellSeconds | 5 | 1～600 秒 | 打开应用与停留 |

## 音乐免会员安装任务（quietstart.music-free-member-install）

已发布 V1：8 项（此前 7 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 本轮最多安装几个应用 | install.maxTasks | 10 | 1～10 个 | 本轮目标 |
| 钱包金币总额目标 | install.targetBalance | 1000 | 1～1000 金币 | 本轮目标 |
| 无任务时最多换一换次数 | install.maxRefreshes | 3 | 0～3  | 安装兼容设置；高级 |
| 额外停留（毫秒） | install.extraDwellMs | 0 | 0～10000  | 安装兼容设置；高级 |
| 领奖后卸载本轮新装应用 | install.cleanupInstalled | true | 开启／关闭 | 任务完成后 |
| 打开应用后停留时长 | install.dwellSeconds | 12 | 1～600 秒 | 打开应用与停留 |

## 起点读书福利中心任务奖励（quietstart.qidian-welfare-center）

已发布 V1：12 项（此前 12 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 激励奖励 | task.quietstart.qidian-welfare-reward | true | 开启／关闭 | 选择要做的任务 |
| 每小时福利 | task.quietstart.qidian-welfare-hourly | true | 开启／关闭 | 选择要做的任务 |
| 三次广告奖励 | task.quietstart.qidian-welfare-three-ads | true | 开启／关闭 | 选择要做的任务 |
| 单次广告奖励 | task.quietstart.qidian-welfare-one-ad | true | 开启／关闭 | 选择要做的任务 |
| 白泽装扮 | task.quietstart.qidian-welfare-astronaut | true | 开启／关闭 | 选择要做的任务 |
| 起点读书查看下方任务 | task.quietstart.qidian-welfare-scroll | true | 开启／关闭 | 旧版查找与领奖设置；高级；仅保留手动项 |
| 领取奖励 | task.quietstart.qidian-welfare-popup | true | 开启／关闭 | 旧版查找与领奖设置；高级；仅保留手动项 |
| 起点读书查看更下方任务 | task.quietstart.qidian-welfare-scroll-more | true | 开启／关闭 | 旧版查找与领奖设置；高级；仅保留手动项 |
| 本轮最多完成几次访问 | goal.maxTasks | 0 | 0～300 次 | 本轮减量 |
| 显示执行胶囊 | ui.showTaskCapsule | true | 开启／关闭 | 进度显示 |

## 汽水音乐免费畅听广告奖励（quietstart.qishui-membership-rewards）

已发布 V1：3 项（此前 3 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 本轮最多看几条广告 | video.maxAds | 300 | 1～300 条 | 本轮目标 |

## QQ音乐金币中心（quietstart.qqmusic-coin-center）

已发布 V1：9 项（此前 9 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 礼物 · 浏览或看视频 | task.quietstart.qqmusic-coin-center-gift-cycle | true | 开启／关闭 | 选择要做的任务 |
| 日常 · 定时金币 | task.quietstart.qqmusic-coin-center-timer | true | 开启／关闭 | 选择要做的任务 |
| 宝箱 · 领取奖励 | task.quietstart.qqmusic-coin-center-chest | true | 开启／关闭 | 选择要做的任务 |
| 视频 · 观看领奖 | task.quietstart.qqmusic-coin-center-video-start | true | 开启／关闭 | 选择要做的任务 |
| 继续做奖励弹窗里的追加广告 | task.quietstart.qqmusic-coin-center-popup | true | 开启／关闭 | 追加奖励 |
| 本轮最多完成几次访问 | goal.maxTasks | 0 | 0～300 次 | 本轮减量 |
| 执行需安装应用的礼物任务 | gift.installRequiredApps | false | 开启／关闭 | 选择要做的任务 |

## QQ音乐免会员视频任务（quietstart.qqmusic-free-listen-video）

已发布 V1：4 项（此前 4 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| QQ音乐免费听歌加时长 | task.quietstart.qqmusic-free-listen-video-cycle | true | 开启／关闭 | 旧版任务开关；高级；仅保留手动项 |
| 本轮最多完成几次访问 | goal.maxTasks | 0 | 0～300 次 | 本轮减量 |

## 跳过开屏广告（quietstart.splash-ad）

已发布 V1：4 项（此前 0 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 自动暂停 | execution.idle.enabled | true | 开启／关闭 | 自动暂停 |
| 连续未点击次数 | execution.idle.visits | 3 | 2～20 次 | 自动暂停 |
| 最少时间跨度 | execution.idle.hours | 1 | 1～168 小时 | 自动暂停 |
| 暂停后复查间隔 | execution.idle.resumeDays | 7 | 1～30 天 | 自动暂停 |

## 淘宝淘金币赚金币任务（quietstart.taobao-taojinbi-earn）

已发布 V1：7 项（此前 7 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 直接领取 | tasks.claim | true | 开启／关闭 | 选择任务类型 |
| 搜索任务 | tasks.search | true | 开启／关闭 | 选择任务类型 |
| 浏览任务 | tasks.browse | true | 开启／关闭 | 选择任务类型 |
| 搜索主题 | search.topic | 衣服 | 衣服、鞋子、数码 | 选择任务类型；[{"key":"tasks.search","values":[true]}] |
| 本轮最多完成几个任务 | goal.maxTasks | 0 | 0～300 个 | 本轮减量 |

## 淘宝淘金币赚能量任务（quietstart.taobao-taojinbi-energy）

已发布 V1：7 项（此前 7 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 直接领取 | tasks.claim | true | 开启／关闭 | 选择任务类型 |
| 搜索任务 | tasks.search | true | 开启／关闭 | 选择任务类型 |
| 浏览任务 | tasks.browse | true | 开启／关闭 | 选择任务类型 |
| 搜索主题 | search.topic | 衣服 | 衣服、鞋子、数码 | 选择任务类型；[{"key":"tasks.search","values":[true]}] |
| 本轮最多完成几个任务 | goal.maxTasks | 0 | 0～300 个 | 本轮减量 |

## 主题免费领好礼三段任务（quietstart.theme-free-gifts）

已发布 V1：13 项（此前 11 项）。

| 参数 | 键 | 默认值 | 可选范围 | 显示位置／条件 |
| --- | --- | --- | --- | --- |
| 进度备注 | progressPrefix | 空文本 | 文本 0～20 字符 | 高级设置；高级 |
| 额外动作间隔（毫秒） | nextActionDelayMs | 0 | 0～1000  | 高级设置；高级 |
| 安装并回到本页面打开应用获100金币 | stage.install.enabled | true | 开启／关闭 | 安装并回到本页面打开应用获100金币 |
| 本轮最多完成 | stage.install.maxTasks | 15 | 1～15 个 | 安装并回到本页面打开应用获100金币；[{"key":"stage.install.enabled","values":[true]}] |
| 第 1 区 · 额外停留（毫秒） | stage.install.extraDwellMs | 0 | 0～10000  | 额外停留；高级 |
| 打开应用获10金币 | stage.open.enabled | true | 开启／关闭 | 打开应用获10金币 |
| 本轮最多完成 | stage.open.maxTasks | 150 | 1～150 个 | 打开应用获10金币；[{"key":"stage.open.enabled","values":[true]}] |
| 第 2 区 · 额外停留（毫秒） | stage.open.extraDwellMs | 0 | 0～10000  | 额外停留；高级 |
| 看视频获20金币 | stage.video.enabled | true | 开启／关闭 | 看视频获20金币 |
| 本轮最多完成 | stage.video.maxTasks | 75 | 1～75 个 | 看视频获20金币；[{"key":"stage.video.enabled","values":[true]}] |
| 领奖后卸载本轮新装应用 | install.cleanupInstalled | true | 开启／关闭 | 安装并回到本页面打开应用获100金币；[{"key":"stage.install.enabled","values":[true]}] |
| 安装后打开应用停留时长 | stage.install.dwellSeconds | 2 | 1～600 秒 | 安装并回到本页面打开应用获100金币；[{"key":"stage.install.enabled","values":[true]}] |
| 打开应用后停留时长 | stage.open.dwellSeconds | 1 | 1～600 秒 | 打开应用获10金币；[{"key":"stage.open.enabled","values":[true]}] |

## 仍未提供用户入口的包内时间值

以下从当前规则声明中逐项提取，属于包内流程／识别配置；不代表全部都应开放为用户参数。脚本内其他常量、识别词表与几何阈值仍由包作者维护。已补齐的安装与主题 dwellMs 现在由对应 dwellSeconds 参数控制。

| 工具包 | 规则路径 | 声明毫秒值 |
| --- | --- | --- |
| 云盘免费领50GB安装任务 | rewardInstall.dwellMs | 5000 |
| 视频免会员安装任务 | rewardInstall.dwellMs | 5000 |
| 音乐免会员安装任务 | rewardInstall.dwellMs | 12000 |
| 起点读书福利中心任务奖励 | landingVisit.dwellMs | 15000 |
| 起点读书福利中心任务奖励 | tasks.0.steps.0.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.0.steps.1.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.0.steps.2.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.0.steps.3.expect.settleMs | 12000 |
| 起点读书福利中心任务奖励 | tasks.1.steps.0.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.1.steps.1.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.1.steps.2.expect.settleMs | 12000 |
| 起点读书福利中心任务奖励 | tasks.2.steps.0.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.2.steps.1.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.2.steps.2.expect.settleMs | 12000 |
| 起点读书福利中心任务奖励 | tasks.3.steps.0.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.3.steps.1.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.3.steps.2.expect.settleMs | 12000 |
| 起点读书福利中心任务奖励 | tasks.4.steps.0.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.4.steps.1.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.4.steps.2.expect.settleMs | 12000 |
| 起点读书福利中心任务奖励 | tasks.5.steps.0.expect.settleMs | 10000 |
| 起点读书福利中心任务奖励 | tasks.6.steps.0.expect.settleMs | 12000 |
| 起点读书福利中心任务奖励 | tasks.7.steps.0.expect.settleMs | 10000 |
| QQ音乐金币中心 | tasks.0.steps.0.expect.settleMs | 5000 |
| QQ音乐金币中心 | tasks.0.steps.1.expect.settleMs | 15000 |
| QQ音乐金币中心 | tasks.0.steps.2.expect.settleMs | 5000 |
| QQ音乐金币中心 | tasks.1.steps.0.expect.settleMs | 8000 |
| QQ音乐金币中心 | tasks.1.steps.1.expect.settleMs | 15000 |
| QQ音乐金币中心 | tasks.1.steps.2.expect.settleMs | 5000 |
| QQ音乐金币中心 | tasks.2.steps.0.expect.settleMs | 8000 |
| QQ音乐金币中心 | tasks.2.steps.1.expect.settleMs | 15000 |
| QQ音乐金币中心 | tasks.2.steps.2.expect.settleMs | 5000 |
| QQ音乐金币中心 | tasks.3.steps.0.expect.settleMs | 12000 |
| QQ音乐金币中心 | tasks.3.steps.1.expect.settleMs | 15000 |
| QQ音乐金币中心 | tasks.3.steps.2.expect.settleMs | 5000 |
| QQ音乐金币中心 | tasks.3.steps.3.expect.settleMs | 12000 |
| QQ音乐金币中心 | tasks.4.steps.0.expect.settleMs | 5000 |
| QQ音乐金币中心 | tasks.4.steps.1.expect.settleMs | 15000 |
| QQ音乐金币中心 | tasks.4.steps.2.expect.settleMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.0.visit.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.0.visit.landingPages.0.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.0.visit.followUpVisit.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.0.visit.followUpVisit.landingPages.0.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.1.visit.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.1.visit.landingPages.0.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.1.visit.followUpVisit.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.1.visit.followUpVisit.landingPages.0.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.2.visit.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.2.visit.landingPages.0.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.2.visit.followUpVisit.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.2.visit.followUpVisit.landingPages.0.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.3.visit.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.3.visit.landingPages.0.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.3.visit.followUpVisit.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.3.visit.followUpVisit.landingPages.0.dwellMs | 15000 |
| QQ音乐金币中心 | taskLandingVisits.4.visit.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.4.visit.landingPages.0.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.4.visit.followUpVisit.dwellMs | 5000 |
| QQ音乐金币中心 | taskLandingVisits.4.visit.followUpVisit.landingPages.0.dwellMs | 5000 |
| QQ音乐金币中心 | missingTargetScroll.settleMs | 500 |
| QQ音乐免会员视频任务 | landingVisit.dwellMs | 10000 |
| QQ音乐免会员视频任务 | landingVisit.landingPages.0.dwellMs | 10000 |
| QQ音乐免会员视频任务 | tasks.0.steps.0.expect.settleMs | 12000 |
| QQ音乐免会员视频任务 | tasks.0.steps.1.expect.settleMs | 15000 |
| 跳过开屏广告 | when.windowMs | 9000 |
| 跳过开屏广告 | steps.0.expect.settleMs | 10000 |
| 主题免费领好礼三段任务 | rewardStages.stages.0.dwellMs | 2000 |
| 主题免费领好礼三段任务 | rewardStages.stages.1.dwellMs | 1000 |
