# PaperPlane Web Console (monorepo) / 数据库实体 (`@repo/db`)

原 [`paperplane-api`](https://git.paperplane.cc/jia-niang/paperplane-api) 中的 `prisma` 部分，现已被分离出来单独作为一个子包。

# 运行需求

- 请安装 Prisma 的 IDE 插件；VSCode 插件：https://marketplace.visualstudio.com/items?itemName=Prisma.prisma
- 请先配置 `.env`，其中的数据库连接字符串应该和 `@repo/server` 中的相同。

# 运行方式

以下指令均可直接在根目录执行，由 `turbo` 转发，无需添加 `-F @repo/db` 参数。

每次修改 Schema 后，请生成数据库实体：

```bash
pnpm run db:gen
# 或
pnpm run db:generate
```

- 此项目中 Prisma 在安装依赖后并 **不会** 自动生成实体（原因见文末），所以刚安装好依赖后，其他子包中的代码可能会标红报错；
- 此项目已配置，从根目录运行 `dev` 或 `build` 时都会自动生成实体；
- 此处的 `src/index.ts` 用于把 `@prisma/client` 转发为 `@repo/db`，不建议修改此文件，此外每次生成实体后都会重新编译一次 TypeScript；
- 如果 IDE 无法读取到新的类型，请重启 TypeScript 服务器；以 VSCode 举例：打开任意 `.ts` 文件，使用快捷键 `Ctrl/Command` + `Shift` + `P`，选择 “重启 TS 服务器” 加载新类型。

---

修改 Schema 完成后，需要将新版数据结构同步到开发环境数据库，同时生成迁移 SQL 文件：

```bash
pnpm run db:mi
# 或
pnpm run db:migrate
```

- 如果 Schema 有改动，请确保在 Git Commit 前执行过此指令，生成迁移 SQL 文件一同提交。

---

本地开发时，**放弃数据库内现有数据** 并直接应用最新版 Schema：

```bash
pnpm run db:push
```

---

生产环境部署数据库改动：

```bash
pnpm run db:deploy
```

- 请确保 CI/CD 会执行这一步。

# 补充说明

- 其他子包中引用实体时，直接使用 `@repo/db` 作为包名即可，而不是 `@prisma/client`；但是，项目中第三方依赖例如 `nestjs-prisma` 的源代码中依然会引用 `@prisma/client`，这些三方依赖的源代码我们无法更改，因此根目录的 `.npmrc` 中配置了将 `@prisma/client` 提升到根目录下，这样才能使得其它项目可以访问到此包；
- `@prisma/client` 中使用 `.prisma/...` 作为导入目录，所以 `prisma` 必须使用默认的输出位置，不能使用 `output` 修改输出位置；
- `prisma` 默认会在 `node_modules/.prisma` 中创建文件，但 `pnpm` 会修改 `node_modules` 的结构，将生成产物转发到特殊的目录，这就需要做额外配置；`@repo/web` 中就使用 `vite` 进行了相关的配置；
- `turbo` 提供了 `prune` 的功能，可以根据需求针对目标子包生成一份最小文件结构，只包含 `package.json`、`pnpm-lock.yaml` 等文件，用来安装依赖，这一份最小文件结构可被 Docker 缓存为 Layer 从而加速构建，但这个最小文件结构不包含 `schema.prisma`，所以如果安装完依赖就马上生成实体，会导致找不到 Schema 文件而报错；
- 此项目的 `src/index.ts` 中使用了 `export *`，这是一个危险的用法；因为 `@repo/server` 是一个从 TypeScript 编译后通过 Node.js 运行的后端项目，它只能兼容 CommonJS 的输入，所以此子包需要用 `tsc` 编译；而 `@repo/web` 虽然支持 TypeScript 输入，但是也用到了枚举类型，这就不能只导入 `.d.ts` 了，需要将它当做 CommonJS 模块，但 `@prisma/client` 中也包含很多后端代码，前端全部导入必然会出错，正好 `prisma` 也考虑到了这一点，它会生成一份 `index-browser.js` 文件并在 `@prisma/client` 的 `package.json` 中通过 `browser` 字段导出供前端项目打包器使用，前端项目导入此文件即可；以上这些问题和 `pnpm` 结合使用时，还会出现找不到路径、开发和打包编译结果不一致等问题，因此在 `vite.config.js` 中针对这些问题进行了配置处理。
