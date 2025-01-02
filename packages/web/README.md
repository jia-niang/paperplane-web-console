# PaperPlane Web Console (monorepo) / Web 端 (`@repo/web`)

原 [`paperplane-app`](https://git.paperplane.cc/jia-niang/paperplane-app) 项目，现合并入 `paperplane-web-console` 此 monorepo 项目，包名 `@repo/web`。

本次迁移更换了开发工具，原先使用 `create-react-app` 以及相关配套工具，现在已换成 `vite`，注意区别。

# 运行方式

本地开发启动（端口 `6200`，后端请求会转发到本机 `6100` 端口）：

```bash
pnpm dev:web
```

---

打包编译生产包：

```bash
pnpm build:web
```

---

预览生产环境包：

```bash
# 根目录
pnpm -F @repo/web preview

# 仅限在此目录可用
pnpm preview
```

- 原版 `vite` 只有预览这一步，此指令额外包含了先打预览包的步骤，打完预览包后进行预览；
- 在 `vite.config.ts` 中有额外配置，打预览包时 CDN 相关变量不生效。

# 补充说明

- `vite.config.ts` 中针对 `@repo/db` 做了较多处理，这是因为 `prisma` 在和 `pnpm` 以及前端项目结合使用时，会产生很多问题，请参考 `@repo/db` 包的 [README.md](../db/README.md) 文件；
- `.env` 中的变量，必须以 `VITE_` 开头才能在项目源码中访问到，且需要使用 `import.meta.env` 来访问而不是 `process.env`；注意，在 `vite.config.ts` 中需要使用 API 来访问这些变量，和源码中的访问方式也有区别；
- 增删环境变量后，请在 `vite-env.d.ts` 中更新它们的类型；
- `vite` 似乎并不支持 CDN 和源站的 subpath 不一样这种场景，因此项目中使用 `VITE_BASE_URL` 和 `VITE_CDN_URL` 这两个变量来区分，且在本地开发运行时以及本地预发布预览时不会应用 `VITE_CDN_URL`；也正因此，不推荐使用 `import.meta.env.BASE_URL` 这个变量，它不一定准确反映项目的 subpath；
- 项目源码中，建议使用 `import.meta.env.MODE` 来判断开发和生产环境，它可以通过 `--mode` 参数来传入，支持自定义任意值，且它和当前的运行模式 “脱钩”，不会影响到项目中的其它依赖。
