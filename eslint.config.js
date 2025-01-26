const js = require('@eslint/js')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const reactHooks = require('eslint-plugin-react-hooks')
const reactRefresh = require('eslint-plugin-react-refresh')
const globals = require('globals')
const tseslint = require('typescript-eslint')

/**
 * ESLint v9 目前默认暂不支持 monorepo 使用各个目录自己的配置
 * 除非开启 --flag unstable_config_lookup_from_file 标志
 *
 * 参考 https://eslint.org/docs/latest/use/configure/configuration-files#experimental-configuration-file-resolution
 */

module.exports = tseslint.config(
  { ignores: ['**/dist'] },

  // ↓ 以下规则适用于：packages/server
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['packages/server/src/**/*.ts', 'packages/server/test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    plugins: {},
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prefer-const': 'warn',
    },
  },

  // ↓ 以下规则适用于：packages/web
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['packages/web/src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ↓ 以下规则适用于：packages/types
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['packages/types/src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {},
  },

  // ↓ 全局忽略：packages/types
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  eslintPluginPrettierRecommended
)
