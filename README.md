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

## 代码边界

| 区域 | 作用 |
| --- | --- |
| `public/` | 静态页面、全站样式、偏好设置与前端模块 |
| `public/preferences.mjs` | 语言、主题、设置面板和共享文案 |
| `public/styles.css` | 首页、模块页、学习工具页的主视觉系统 |
| `public/game/board/*` | 三个棋类游戏的发布版前端与引擎 |
| `tools/padic/` | p进数转换器的终端版源码与安装资源 |
| `server.mjs` | 静态文件服务、棋类联机房间、p进数转换 API |

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

## 维护规则

- UI 修改先看 `STYLE_GUIDE.md`，保持安静、清楚、深远、克制、有秩序。
- 语言文案优先进入 `public/preferences.mjs`，不要在页面里散落硬编码文案。
- 设置入口、主题切换、语言切换属于全站基础设施，修改后至少验证首页、学习工具页和一个棋类页。
- 棋类游戏是发布版副本；除非任务明确要求，不把它们重构成新的项目结构。
- 发布记录写入 `CHANGELOG.md`，按用户可感知变化组织，不堆内部流水。

## 当前重点

1. 全站设置面板保持清晰、稳定、无视觉残影。
2. 学习工具的语言覆盖要完整，包括标题、表单、状态和可访问标签。
3. Markdown 文档承担项目导航和风格传承，不只保存历史碎片。
