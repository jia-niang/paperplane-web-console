import { useTitle } from 'ahooks'
import { last, noop, pick, uniqBy } from 'lodash-es'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLocation, useMatch, useMatches, useNavigate } from 'react-router'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { RouteObjectType } from '@/router/routes'
import { traverseTree } from '@/utils/traverseTree'

export interface ICustomBreadcrumbOptions {
  title?: string
  breadcrumb?: ReactNode
}

const initCustomBreadcrumb = {}

export interface IRouterStore {
  navigate: ReturnType<typeof useNavigate>
  customBreadcrumb: {
    [key: string]: ICustomBreadcrumbOptions
  }
  setNavigate(navigate: ReturnType<typeof useNavigate>): void
  configCustomBreadcrumb(key: string, value: ICustomBreadcrumbOptions): void
  removeCustomBreadcrumb(key: string): void
  clearCustomBreadcrumb(): void
}

const useRouterStore = create<IRouterStore>()(
  immer(set => ({
    navigate: noop as ReturnType<typeof useNavigate>,
    customBreadcrumb: initCustomBreadcrumb,
    setNavigate: navigate => {
      set({ navigate })
    },
    configCustomBreadcrumb: (key: string, value: ICustomBreadcrumbOptions) => {
      set(t => {
        t.customBreadcrumb[key] = value
      })
    },
    removeCustomBreadcrumb: (key: string) => {
      set(t => {
        delete t.customBreadcrumb[key]
      })
    },
    clearCustomBreadcrumb: () => {
      set({ customBreadcrumb: initCustomBreadcrumb })
    },
  }))
)

function useCustomRouteStack(): ICustomRoute[] {
  const customBreadcrumb = useRouterStore(t => t.customBreadcrumb)
  const matchesRoutes = useMatches()
  const currentRoutes = useMemo(() => {
    return uniqBy(matchesRoutes, 'pathname').map(item => {
      const matchCustomConfig = customBreadcrumb[item.pathname]

      return {
        id: item.id,
        link: item.pathname,
        title: matchCustomConfig?.title || item.handle.title,
        breadcrumbTitle:
          matchCustomConfig?.breadcrumb ||
          matchCustomConfig?.title ||
          item.handle.breadcrumb?.overrideTitle ||
          item.handle.title ||
          `(未知)`,
      }
    })
  }, [matchesRoutes, customBreadcrumb])

  return currentRoutes
}

export interface ICustomRoute {
  id: string
  link?: string
  title: string
  breadcrumbTitle: ReactNode
}

/** 面包屑导航专用的 route 栈 */
export function useCustomRoutesForBreadcrumb(): ICustomRoute[] {
  const currentRoutes = useCustomRouteStack()
  const pathname = useLocation().pathname
  const [result, setResult] = useState(() => currentRoutes)

  useEffect(() => {
    const isHomepage = pathname === '/'
    if (!isHomepage) {
      setResult(currentRoutes)
    }
  }, [currentRoutes, pathname])

  return result
}

export function handleRouteTree(routes: RouteObjectType[]): RouteObjectType[] {
  traverseTree(routes, item => {
    item.handle = { ...pick(item, ['title', 'breadcrumb']), ...item.handle }
  })

  return routes
}

/** 定制当前页面的标题和面包屑导航 */
export function useCustomRoute(path: string, options: ICustomBreadcrumbOptions) {
  const optionsMemo = useMemo(() => options, [options])
  const match = useMatch(path)
  const key = match?.pathnameBase

  useEffect(() => {
    if (key) {
      useRouterStore.getState().configCustomBreadcrumb(key, optionsMemo)
    }

    return () => {
      if (key) {
        useRouterStore.getState().removeCustomBreadcrumb(key)
      }
    }
  }, [path, optionsMemo, key])
}

/** 安装路由和网站 title 控制 */
export function useSetupRouter() {
  const navigate = useNavigate()
  const { setNavigate } = useRouterStore()

  useEffect(() => void setNavigate(navigate), [navigate, setNavigate])

  const routes = useCustomRouteStack()
  const lastRoute = last(routes)
  const title = lastRoute?.title

  useTitle(title ? `${title} | ${import.meta.env.VITE_WEBSITE_TITLE}` : `${import.meta.env.VITE_WEBSITE_TITLE}`)
}

/** 在任意位置导航 */
export const navigate: ReturnType<typeof useNavigate> = (...restProps) =>
  // @ts-expect-error 无法通过 any 类型处理
  useRouterStore.getState().navigate(...restProps)
