# PaperPlane Web Console (monorepo) / 数据库实体 (`@repo/db`)

原 [`paperplane-api`](https://git.paperplane.cc/jia-niang/paperplane-api) 中的 `prisma` 部分，现已被分离出来单独作为一个子包。

# IDE 插件

请安装 Prisma 的 IDE 插件。

VSCode 插件：https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

# 运行需求

请先配置 `.env`，可参照 `.env.example` 中的示例尽可能完整配置。

# 运行方式

以下指令均可直接在根目录执行，由 `turbo` 转发，无需添加 `-F @repo/db` 参数。

每次修改 Schema 后，请生成数据库实体：

```bash
pnpm run db:gen
# 或
pnpm run db:generate
```

- 安装依赖后会自动生成，所以 `pnpm i` 之后不需要手动运行；
- 如果 IDE 无法读取到新的类型，请重启 TypeScript 服务器；以 VSCode 举例：使用快捷键 `Ctrl/Command` + `Shift` + `P`，选择 “重启 TS 服务器” 加载新类型。

---

修改 Schema 完成后，需要将新版数据结构同步到开发环境数据库，同时生成迁移 SQL 文件：

```bash
pnpm run db:mi
# 或
pnpm run db:migrate
```

- 如果 Schema 有改动，请确保在 Git Commit 前执行过此指令。

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
