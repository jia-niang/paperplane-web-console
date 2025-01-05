/// <reference types="vite/client" />
import type { AgnosticRouteMatch } from 'react-router'

import type { RouterHandleType } from './router'

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

declare module 'react-router' {
  interface UIMatch<Data = unknown, Handle = RouterHandleType> {
    id: string
    pathname: string
    params: AgnosticRouteMatch['params']
    data: Data
    handle: Handle
  }
  function useMatches(): UIMatch<unknown, RouterHandleType>[]
}
