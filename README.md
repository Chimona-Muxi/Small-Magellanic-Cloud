# Small Magellanic Cloud

Small Magellanic Cloud 是张墨霖的个人网站：一个把日常、学习工具、棋类游戏和后续实验统一发布出来的小型星云仓库。

它不是营销页，也不是作品集皮肤。它更像一个安静、可持续扩展的个人系统：入口少，结构清楚，打开就能使用。

## 站点地图

| 路径 | 内容 | 状态 |
| --- | --- | --- |
| `/` | 首页与模块入口 | 已启用 |
| `/game/` | 游戏总入口 | 已启用 |
| `/game/board/` | 棋类集合 | 已启用 |
| `/game/board/luqiangqi/` | 墙路棋 | 已启用 |
| `/game/board/xiyangtiaoqi/` | 西洋跳棋 | 已启用 |
| `/game/board/tuerqitiaoqi/` | 土耳其跳棋 | 已启用 |
| `/study/` | 学习工具总入口 | 已启用 |
| `/study/padic/` | p进数转换器 | 已启用 |
| `/study/padic/downloads/` | p进数转换器安装器下载 | 已启用 |
| `/study/padic/web/` | 浏览器版 p进数转换器 | 已启用 |
| `/study/algebra/` | 高等代数学习辅助器 | 已启用 |
| `/study/analysis/` | 数学分析学习辅助器 | 已启用 |
| `/private/` | 私人空间 | 已启用 |

## 代码边界

| 区域 | 作用 |
| --- | --- |
| `public/` | 静态页面、全站样式、偏好设置与前端模块 |
| `public/preferences.mjs` | 语言、主题、设置面板和共享文案 |
| `public/styles.css` | 首页、模块页、学习工具页的主视觉系统 |
| `public/game/board/*` | 三个棋类游戏的发布版前端与引擎 |
| `tools/padic/` | p进数转换器的终端版源码与安装资源 |
| `tools/study/algebra/` | 高等代数学习辅助器原 Python/SymPy 项目核心 |
| `tools/study/analysis/` | 数学分析学习辅助器原 Python/SymPy 项目核心 |
| `docs/study-tools-manual.md` | 两个学习辅助器的网页发布、CLI、API 与部署说明 |
| `server.mjs` | 静态文件服务、棋类联机房间、p进数转换 API、学习辅助器 Python 桥接 API |

## 本地运行

```bash
npm install
npm start
```

默认地址：

```text
http://localhost:5226
```

如果 5226 被占用，可以临时指定端口：

```bash
PORT=5232 HOST=127.0.0.1 npm start
```

## 部署

Render 配置保持轻量：

| 项 | 值 |
| --- | --- |
| Language | Node |
| Build Command | `npm install` |
| Start Command | `node server.mjs` |
| Root Directory | 留空 |

学习辅助器依赖 Python/SymPy。`npm install` 会通过 `postinstall` 自动执行：

```bash
npm run install:study
```

依赖会安装到 `tools/study/python-packages/`，服务端运行 Python 核心时会自动注入 `PYTHONPATH`。如果部署平台跳过了 `postinstall`，第一次运行学习工具时服务端也会尝试补装一次。

默认依赖只安装基础 CAS 需要的 SymPy，避免 Render 冷启动时被 Matplotlib 等绘图包拖到超时。需要本地绘图能力时再执行：

```bash
npm run install:study:plot
```

## 私人数据的加密 GitHub 备份

私人空间可以把完整 ZIP 归档先在服务端用随机 AES-256-GCM 加密，再用 RSA-OAEP-SHA256 公钥封装本次 AES 密钥，最后只把版本化的 `.smcbackup` 密文写入一个专用 GitHub 私有仓库。RSA 私钥和私钥口令只由使用者离线保管，不上传 GitHub，也不提供给网站服务端。

### 1. 准备专用私有仓库

- 仓库必须是 **Private**，建议只用于这一项备份，并先创建一次 README 或初始提交。
- 如果使用 `Chimona-Muxi/sirenshuju`，必须先在 GitHub 设置中将其改为 Private；接入检查时它还是空的 Public 仓库，当前服务会在上传前强制查询仓库属性并拒绝任何公开仓库。
- 创建一个 fine-grained personal access token，只授权这个仓库，授予 Metadata 读取和 Contents 读写权限。不要把 token 写入源码、提交、浏览器或备份仓库。

服务不会创建仓库，也不会自动把既有仓库改成私有。GitHub 不允许给完全空的仓库创建第一个引用，所以应先初始化一个 `main` 分支提交（例如创建 README）。

### 2. 在本机生成密钥

```bash
npm run backup:keygen -- --bits 4096 --out-dir ~/smc-backup-key
```

脚本会在交互终端中两次询问口令，生成：

- `smc-backup-private.pem`：AES-256-CBC 口令加密的 PKCS#8 私钥，权限设为 `600`；
- `smc-backup-public.json`：SPKI DER 公钥的 Base64 值和 SHA-256 指纹，可用于服务端配置。

不指定输出目录时默认写入 `~/.smc-backup-keys/`，避免私钥意外落入项目仓库。脚本绝不显示私钥内容。私钥和口令应分别保存在可靠的离线位置；任一丢失都会导致备份无法恢复。更换公钥后也必须保留旧私钥，才能解密旧备份。

### 3. 配置服务端

| 环境变量 | 必需 | 说明 |
| --- | --- | --- |
| `SMC_BACKUP_GITHUB_REPO` | 是 | `owner/repository`，例如 `Chimona-Muxi/sirenshuju` |
| `SMC_BACKUP_GITHUB_TOKEN` | 是 | 仅授权上述私有仓库的 fine-grained token |
| `SMC_BACKUP_PUBLIC_KEY_B64` | 是 | `smc-backup-public.json` 中的 `publicKeyB64`，只放公钥 |
| `SMC_BACKUP_GITHUB_BRANCH` | 否 | 专用分支，默认 `smc-private-backup` |
| `SMC_BACKUP_DEBOUNCE_MINUTES` | 否 | 数据最后一次保存后等待多久备份，默认 15，范围 1–1440 分钟 |
| `SMC_BACKUP_RETENTION_DAYS` | 否 | 保留最近多少个每日副本，默认 30，范围 1–365 |

配置完整后，个人资料或加密私人库成功保存、以及本地 ZIP 恢复成功后，会重新开始防抖计时。备份失败不会让原本的数据保存失败。已登录的私人会话还可调用：

- `GET /api/private/backup/status`：查看配置、等待、运行和上次结果；
- `POST /api/private/backup/run`：立即执行一次备份。

首次运行前应确认状态接口返回的 `recipientFingerprintSha256` 与本机 `smc-backup-public.json` 中的 `fingerprintSha256` 完全一致，防止把数据加密给错误公钥。

每次写入只让专用分支指向一个没有父提交的新快照；快照中只有 `latest.smcbackup` 和最近 N 个 `daily/YYYY-MM-DD.smcbackup`。内容没有变化且无需清理超额旧副本时不写新提交；降低保留数量后可只重建索引，不重复上传密文。为防止误删，若专用分支已经含有其他文件、子模块或异常树结构，服务会拒绝覆盖。这会控制可达 Git 历史的体积，但 GitHub 何时回收不可达对象由 GitHub 决定，不能保证对象立即物理删除。

`.smcbackup` 公开了格式版本、时间、密文长度、公钥指纹以及用于去重的 HMAC-SHA256 指纹；它不含明文 ZIP、私钥或原始数据哈希。ZIP 的 SHA-256 被放在 AES-GCM 密文载荷内部。HMAC 密钥由服务端 token 做域隔离派生，因此更换 token 会产生一次新的快照；去重指纹仍会暴露“两次数据是否相同”这一关系，所以仓库必须保持私有。

### 4. 恢复

从私有仓库下载 `latest.smcbackup` 或某个每日副本，在持有私钥的本机运行：

```bash
npm run backup:restore -- \
  --input latest.smcbackup \
  --private ~/smc-backup-key/smc-backup-private.pem \
  --output smc-private-data-restored.zip
```

恢复脚本在终端中隐藏输入口令，用 RSA 私钥解封装 AES 密钥，验证 GCM 认证标签、已认证元数据、ZIP 结构、长度和 SHA-256 后才写出权限为 `600` 的 ZIP。随后可在私人空间的数据管理页面选择该 ZIP 恢复。不指定输出路径时默认写入 `~/.smc-backup-restores/`；默认不覆盖已有文件，确需覆盖时显式添加 `--force`。

安全边界：GitHub token 与公钥存在服务端环境中，私钥只在恢复设备上；拥有服务端控制权的人可以读取备份前的运行时数据，因此这套设计保护的是 GitHub 仓库中的静态备份，不替代服务器本身的访问控制、更新和审计。AES-GCM 能发现容器被改动，但本格式没有另加发送方数字签名；RSA 公钥的持有者都能生成可解密容器，所以恢复时仍需确认文件确实来自受控的专用私有仓库。

## 维护规则

- UI 修改先看 `STYLE_GUIDE.md`，保持安静、清楚、深远、克制、有秩序。
- 语言文案优先进入 `public/preferences.mjs`，不要在页面里散落硬编码文案。
- 设置入口、主题切换、语言切换属于全站基础设施，修改后至少验证首页、学习工具页和一个棋类页。
- 棋类游戏是发布版副本；除非任务明确要求，不把它们重构成新的项目结构。
- 高等代数与数学分析学习辅助器以 `tools/study/*` 下的原 Python 项目为核心；网页只做发布壳、输入提交、输出展示和说明，不另写一套数学镜像。
- 学习工具线上默认依赖保持轻量；除非页面需要展示图像，不把 NumPy/Matplotlib 放回默认部署依赖。
- 发布记录写入 `CHANGELOG.md`，按用户可感知变化组织，不堆内部流水。

## 当前重点

1. 全站设置面板保持清晰、稳定、无视觉残影。
2. 学习工具的语言覆盖要完整，包括标题、表单、状态和可访问标签。
3. Markdown 文档承担项目导航和风格传承，不只保存历史碎片。
