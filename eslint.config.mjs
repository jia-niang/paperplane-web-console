import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

/**
 * ESLint v9 目前默认暂不支持 monorepo 使用各个目录自己的配置
 * 除非开启 --flag unstable_config_lookup_from_file 标志
 *
 * 参考 https://eslint.org/docs/latest/use/configure/configuration-files#experimental-configuration-file-resolution
 */

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/dist'] },

  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // ↓ 以下规则适用于：packages/server
  {
    files: ['packages/server/{src,test}/**/*.ts'],
    plugins: {},
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'prefer-const': 'warn',
    },
  },

  // ↓ 以下规则适用于：packages/web
  {
    files: ['packages/web/src/**/*.{ts,tsx}'],
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
    files: ['packages/types/src/**/*.ts'],
    rules: {},
  },

  // ↓ 全局
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

  eslintPluginPrettierRecommended,
]
