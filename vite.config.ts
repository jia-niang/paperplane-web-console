import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_CDN_URL || env.VITE_BASE_URL,

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
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

    plugins: [
      viteStaticCopy({
        targets: [
          { src: 'node_modules/react/umd/react.production.min.js', dest: '.' },
          { src: 'node_modules/react-dom/umd/react-dom.production.min.js', dest: '.' },
        ],
      }),
      svgr(),
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],

    build: {
      rollupOptions: {
        external: ['react-dom'],
        output: {
          paths: {
            react: '/react.production.min.js',
            'react-dom': '/react-dom.production.min.js',
          },
        },
      },
    },

    server: {
      port: 6200,

      proxy: {
        '/api': {
          target: 'http://localhost:6100',
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
