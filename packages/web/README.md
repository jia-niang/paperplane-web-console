# PaperPlane Web Console (monorepo) / Web 端 (`@repo/web`)

原 [`paperplane-app`](https://git.paperplane.cc/jia-niang/paperplane-app) 项目，现合并入 `paperplane-web-console` 此 monorepo 项目，包名 `@repo/web`。

本次迁移更换了开发工具，原先使用 `create-react-app` 以及相关配套工具，现在已换成 `vite`，注意区别。

# 使用方式

本地开发启动（端口 `6200`，后端请求会转发到本机 `6100` 端口）：

```bash
pnpm run dev
```

---

生产环境打包：

```bash
pnpm run build
```
