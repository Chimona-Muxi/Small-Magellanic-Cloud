# Small Magellanic Cloud

我的个人网站代码。当前结构采用“总网站发布仓库 + 各子项目独立开发仓库”的方式：

- `/`：个人网站首页
- `/game/`：游戏模块
- `/game/board/`：棋类游戏集合
- `/game/board/luqiangqi/`：路墙棋
- `/game/board/xiyangtiaoqi/`：西洋跳棋
- `/game/board/tuerqitiaoqi/`：土耳其跳棋

## 本地运行

```bash
npm install
npm start
```

默认访问：

```text
http://localhost:5226
```

## Render

- Language: Node
- Build Command: `npm install`
- Start Command: `node server.mjs`
- Root Directory: 留空
