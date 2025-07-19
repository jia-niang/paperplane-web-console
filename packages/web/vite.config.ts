import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import url from 'url'
import { AliasOptions, defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())

  const extraAlias: AliasOptions = {}

  if (command === 'build') {
    const prismaDir = path.dirname(url.fileURLToPath(import.meta.resolve('@prisma/client')))
    const prismaBrowserLib = url.resolve(prismaDir, '../.prisma/client/index-browser.js')

    extraAlias['.prisma/client/index-browser'] = prismaBrowserLib
  }

  return {
    base: command === 'serve' || mode === 'development' ? env.VITE_BASE_URL : env.VITE_CDN_URL || env.VITE_BASE_URL,

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        ...extraAlias,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },

    plugins: [react(), visualizer()],

    optimizeDeps: {
      include: ['@repo/db'],
    },

    build: {
      commonjsOptions: {
        include: [/'@repo\/db'/, /packages\/db/, /node_modules/],
      },
    },

    server: {
      port: 6200,
      host: true,

      proxy: {
        '/api': {
          target: 'http://localhost:6100',
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
