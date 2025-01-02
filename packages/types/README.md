# PaperPlane Web Console (monorepo) / 公共类型 (`@types/repo`)

全局常用的类型。

# 原理

- 此子包被命名为 `@types/repo`，因此其他包将此子包作为依赖项后，pnpm 会将此包链接到使用者的 `node_modules/@types/repo` 处，使得其他包的 TypeScript 可自动读取到此子包中的类型定义，无需额外配置；
- 因为此包属于纯类型定义，因此所有文件都需要使用 `.d.ts` 结尾，这带来了两个好处：其他包使用类型时不需要 `import` 类型，不需要使用 `tsc` 等对此包进行编译。
