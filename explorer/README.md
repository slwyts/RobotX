# ROBOTX Project

ROBOTX 区块浏览器 - 赛博朋克风格的 ROBOTX 区块链浏览器 1:1 高保真复刻版。

## 技术栈

- React 18+
- Tailwind CSS
- Lucide React
- JavaScript ES6+

## 启动

```bash
npm install
cp .env.example .env
npm start
```

浏览器访问 http://localhost:3000

## 环境变量

在 explorer 根目录配置以下变量：

```bash
REACT_APP_RPC_URL=https://rpc.robotxhub.ai
REACT_APP_CHAIN_ID=2679
REACT_APP_EXPLORER_URL=https://explorer.robotxhub.ai
```

说明：
- REACT_APP_RPC_URL: 前端发起 JSON-RPC 请求以及钱包添加链时使用的 RPC 地址
- REACT_APP_CHAIN_ID: 链 ID 的十进制值，当前为 2679，前端会自动换算为 0xA77
- REACT_APP_EXPLORER_URL: 钱包添加链时使用的区块浏览器地址
- 修改 .env 后需要重启开发服务器
