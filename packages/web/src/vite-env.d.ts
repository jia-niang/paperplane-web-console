/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production'
  readonly VITE_BASE_URL: string
  readonly VITE_WEBSITE_TITLE: string
  readonly VITE_API_BASE_URL: string

  readonly BASE_URL: never
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
