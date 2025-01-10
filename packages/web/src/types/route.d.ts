import type { AgnosticRouteMatch } from 'react-router'

import type { RouterHandleType } from './router'

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
