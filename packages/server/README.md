# PaperPlane Web Console (monorepo) / 服务端 (`@repo/server`)

原 [`paperplane-api`](https://git.paperplane.cc/jia-niang/paperplane-api) 项目，现合并入 `paperplane-web-console` 此 monorepo 项目，包名 `@repo/server`。

原先项目内包含的 `prisma` 部分已作为单独一个子包 `@repo/db` 独立出去了，项目中的 `import` 语句使用 `'@repo/db'` 取代原来的 `'@prisma/client'`。

# 运行需求

请先配置 `.env`，可参照 `.env.example` 中的示例尽可能完整配置：

- **必须** 能正常连接 PostgreSQL、Redis、RabbitMQ，否则无法启动；
- **必须** 配置 OpenAI 或 Azure OpenAI 的令牌不为空，否则会导致 SDK 初始化失败报错；
- **建议** 正确配置兼容 S3 规范的存储服务，否则无法使用文件存储相关功能（例如每日下班提醒生成图片）；
- **建议** 正确配置百度地图和聚合数据等第三方数据 API 令牌，否则无法使用第三方数据接口（例如每日下班提醒生成图片）；
- 企微相关功能需要配置 IP 白名单，可使用 `WXBIZ_PROXY_URL` 配置企微的代理，把 IP 固定为代理服务器的地址；
- 第三方数据 API 服务服务需要网络连接通畅（例如 OpenAI）；
- 如果用到本机运行状态相关功能，则需能连接到 Docker Engine API。

注意：现在不再使用 `@nestjs/config` 来配置环境变量，因为它加载环境变量的时机较晚，行为不透明；现在使用的是 `dotenv-cli`，但这也导致环境变量文件更改后，必须重新运行项目才能生效。

# 运行方式

本地开发启动（端口 `6100`）：

```bash
pnpm dev:server
```

---

生产环境打包：

```bash
pnpm build:server
```

已打包后，在生产环境下运行：

```bash
# 根目录
pnpm -F @repo/server start:prod

# 仅限在此目录可用
pnpm start:prod
```
