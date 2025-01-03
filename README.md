# PaperPlane Web Console (monorepo)

包含原 [`paperplane-api`](https://git.paperplane.cc/jia-niang/paperplane-api) 和 [`paperplane-app`](https://git.paperplane.cc/jia-niang/paperplane-app) 项目。

# 子包

- `packages/db`：包名 `@repo/db`，包含各种数据库实体类型；
- `packages/server`：包名 `@repo/server`，后台服务；
- `packages/types`：包名 `@types/repo`，全局类型定义，它不需要 `import` 即可全局使用；
- `packages/web`：包名 `@repo/web`，前端网站。

# 运行需求

本项目对系统内已安装的应用有要求：

- 必须已安装 Node.js 20 及以上版本，这是必须的运行条件；
- 如果有用到 `puppeteer` 相关功能（例如每日下班提醒生成图片），则需求已安装 Chrome/Chromium；
- 如果有用到 `simple-git` 相关功能（例如 Git 周报助手），则需求已安装 Git。

为了让本地和云端环境一致，建议使用 Docker 来运行，项目中随附有相关配置，见下文。

## macOS 在 Docker 中运行

此运行方式需要已安装 Docker；对环境依赖较小，且可以做到和部署后的服务端环境保持一致，推荐使用此方式。

```bash
# 启动
docker compose up

# 如果需要执行其它命令，例如 pnpm i，可以新开一个容器 bash
docker exec -it paperplane-web-console-local bash
```

如果遇到启动问题以及 `puppeteer` 报错，可以参考文末的疑难解答部分。

## Windows 通过 wsl2 在 Docker 中运行

不推荐直接在 Windows 中启动 Docker 进行开发，因为 Windows 系统和 Docker 容器之间的文件交互性能较差，挂载目录可能无法即时监听文件更改，表现为启动项目极慢、更改了代码后不能马上重新编译等问题。

推荐使用 wsl2 创建一个 Ubuntu 子系统，在其中使用 Docker 并配合 VSCode 的远程开发能力来进行开发。

步骤：

- 本机已安装 [wsl2](https://learn.microsoft.com/zh-cn/windows/wsl/install)；
- 本机已安装 Docker，并在安装时选择 “使用 wsl2 引擎”，或是在 wsl2 中自行安装 Docker；
- 在 VSCode 中安装远程开发套件，[点此链接安装](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)，它包含了 SSH 远程开发、容器远程开发等多个工具，可以直接连接 wsl，且连接后会自动初始化远程环境；如果你使用了其他的编辑器 / IDE，请自行寻找对应的插件。

> 你也可以只安装 [WSL 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)，此时也可以连接到 wsl，但 Git 等工具还需要手动安装一遍（指令 `sudo apt-get update && sudo apt-get install git`），所以不推荐单独使用这个扩展。

安装扩展后，VSCode 左侧边栏会出现 “远程资源管理器”，此时便可以在 wsl 子系统中克隆仓库并打开。  
建议转到 VSCode “扩展” 页面，部分扩展需要在子系统中重新安装一遍。

运行项目：  
打开 VSCode 终端，此时终端已连接到 wsl 子系统中，执行：

```bash
# 启动
docker compose up

# 如果需要执行其它命令，例如 pnpm i，可以新开一个容器 bash
docker exec -it paperplane-web-console-local bash
```

需知：

- 代码创建出的文件属于用户 `root`，而 `wsl` 如果用其它用户登录，可能没法直接删除这些文件；
- 如果曾在 Windows 上运行过 `pnpm i` 安装依赖，这些依赖项在 Docker 中不兼容，启动时可能会报错，遇到此情况请删除项目中所有 `node_modules` 再运行 `docker compose up`。

## 使用 VSCode 的 “开发容器” 在 Docker 中运行

此方法会使用 `.devcontainer` 目录以及其中的配置文件，请确保已安装 Docker 以及 [VSCode 远程开发扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)。

步骤：

- 点击 VSCode 左侧边栏的 “远程资源管理器”；
- 下拉菜单选择 “开发容器”，此处会列出当前运行的 Docker 容器；
- 点击 “+” 图标，在弹出的菜单中选择 “在容器中打开当前文件夹”，此时 VSCode 会自动创建一个 Docker 容器，将拷贝项目文件放入并连接到容器内的文件系统和终端，此时请稍作等待，因为 VSCode 需要在容器中安装扩展以及 Git 等工具；
- 这种方式不会自动安装依赖，请打开终端并运行 `pnpm i`，依赖安装完成后，可以运行 `pnpm i` 启动。

需知：

- VSCode 会自动管理 SSH 密钥，但如果提交代码时仍报错无权限，请执行 `ssh-add`；如果使用 HTTPS 克隆或者使用 GPG 密钥，请参考 [官网文档](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials)；
- Windows 系统下直接启动开发容器，修改文件仍然无法及时反馈到容器中。如果有实时调试的需求，请在 wsl 环境中克隆项目并从中启动开发容器；
- 如果曾在 Windows 上运行过 `pnpm i` 安装依赖，这些依赖项在 Docker 中不兼容，启动时可能会报错，遇到此情况请删除项目中所有 `node_modules` 再运行 `docker compose up`。

## 本机直接运行

需求 Node.js 的 20 及以上版本，[点此下载最新版](https://nodejs.org/) 或者 [点此选择一个版本下载](https://nodejs.org/en/download/releases)。

```bash
# 全局安装 pnpm，只需运行一次
npm i -g pnpm

# 启动
pnpm i
```

需要注意的是，`puppeteer` 调用本机浏览器时，浏览器窗口可能会一闪而过；同时浏览器的默认字体在 Windows、macOS、Linux 系统上均不同，显示效果也会存在差异，使用 Docker 运行则不会有此问题。

# 命令

开发运行（前端端口 `6200`，后端端口 `6100`，开发服务器已配置自动转发）：

```bash
pnpm dev
```

---

打包编译（产物位于各子包内的 `dist` 目录）：

```bash
pnpm build
```

# 补充说明

## 本地开发：使用 Docker Compose 直接运行镜像

- 挂载整个开发目录到镜像中运行，启动时会进行一次 `pnpm i`；
- 如果当前是 Windows 系统，挂载到 node 镜像中可能会不兼容，运行缓慢甚至直接报错，所以推荐 Windows 环境在 wsl 中启动 Docker；
- 前端和后端同时运作，暴露 `6100` 和 `6200` 端口到宿主机；
- 可通过 `host.docker.internal` 这个域名来访问宿主机，类似于 `localhost`。

## 生产环境：使用 Dockerfile 构建镜像

- 构建镜像前，**必须运行 `pnpm ci:prepare-docker` 生成一份仅包含项目依赖项的目录结构**，这是为了利用 Layer 机制加快构建，Dockerfile 中有用到这个目录，不存在则会报错；
- 可以使用 `docker build -t <镜像名> .` 在本地构建生产包，如果 npm 连接不畅通，可以添加 `--build-arg NPM_REGISTRY=https://registry.npmmirror.com` 参数；
- 生产镜像仅运行服务端，暴露 `6100` 端口；前端文件可通过命令 `docker cp <容器名>:/paperplane-web-console/package/web/dist/ <目标位置>` 复制出来；
- 所有 `.local` 后缀的环境变量文件不会包含在镜像内，运行时请自行挂载到 `/paperplane-web-console/packages/server/env.production.local` 以及 `/paperplane-web-console/packages/db/env.production.local`。

## 关于基础镜像

因为使用到 `puppeteer`、`git` 等工具，对运行环境有要求，Node.js 基础镜像无法满足需求，需要使用特定的基础镜像来运行。
注意，请不要使用 `-slim`、`-alpine` 类型的镜像，它们缺少一些指令（例如 `ps`）会导致某些功能运行时报错。

在文件 `Dockerfile` 中可以看到使用 [`paperplanecc/paperplane-api-base`](https://hub.docker.com/r/paperplanecc/paperplane-api-base) 作为基础镜像。  
此镜像是专门为本项目准备、已事前构建好的。

也可以自行构建基础镜像，此处给出基础镜像的构建方式：

```Dockerfile
FROM node:20.13.0

RUN apt-get update

RUN apt-get install -y git

RUN apt-get install -y chromium --no-install-recommends

RUN apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf fonts-noto-color-emoji  --no-install-recommends

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN npm i -g pnpm
```

构建的步骤中需要访问 Google，请确保具备国际互联网访问能力。  
因为 Chrome 在非 macOS 的 arm64 平台没有提供二进制包，所以使用 Chromium 浏览器。

## macOS 的 Docker 问题

注：目前已提供 arm 架构的基础镜像，以下这些因为芯片架构导致的问题不再会遇到了。

出现 “Rosetta is only intended to run on Apple Silicon with a macOS host using Virtualization.framework with Rosetta mode enabled” 问题时：

- 请将 Docker Desktop 更新到最新版，这是关键步骤；
- 使用快捷键 `Commend` + `,` 打开设置；
- 确保 “Use Virtualization framework” 已勾选；
- 点击右下角 “Apply & restart”，使设置生效。

调用 prisma 时出现 “assertion failed [block != nullptr]: BasicBlock requested for unrecognized address” 等问题时：

- 建议将 Docker Desktop 更新到最新版；
- 使用快捷键 `Commend` + `,` 打开设置；
- 确保 “Use Virtualization framework” 已勾选；
- 建议勾选 “Use containerd for pulling and storing images”，注意勾选此选项并接受后，Docker 将清空所有镜像和容器，就像被重新安装了一样；
- 如果勾选 “Use Rosetta for x86/amd64 emulation on Apple Silicon”，则会使用 Rosetta2 对非 arm 的容器进行转译运行，这可以解决本项目曾遇到的 puppeteer 无法运行的问题，不勾选则使用 QEMU 来模拟 x86_64 环境，此处推荐勾选，并结合上一条步骤一同使用；
- 点击右下角 “Apply & restart”，使设置生效。
