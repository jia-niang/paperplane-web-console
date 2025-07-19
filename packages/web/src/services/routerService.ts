import { useTitle } from 'ahooks'
import { noop, pick, uniqBy } from 'lodash-es'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLocation, useMatch, useMatches, useNavigate } from 'react-router'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { RouteObjectType } from '@/router/routes'
import { traverseTree } from '@/utils/traverseTree'

export interface ICustomBreadcrumbOptions {
  title?: string
  breadcrumb?: ReactNode

  /** 如果需要多级面包屑，此配置可在 breadcrumb 的面包屑前面插入任意个节点 */
  insertBeforeBreadcrumbs?: { breadcrumb: ReactNode; link?: string; id?: string }[]
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
    const result: ICustomRoute[] = []
    uniqBy(matchesRoutes, 'pathname').forEach(item => {
      const matchCustomConfig = customBreadcrumb[item.pathname]
      const insertConfigs = matchCustomConfig?.insertBeforeBreadcrumbs

      if (matchCustomConfig?.breadcrumb && Array.isArray(insertConfigs)) {
        insertConfigs.forEach((insertItem, insertIdx) => {
          result.push({
            id: insertItem.id || `insert.${insertIdx}_${item.id}`,
            link: insertItem.link || item.pathname,
            breadcrumb: insertItem.breadcrumb,
          })
        })
      }

      result.push({
        id: item.id,
        link: item.pathname,
        title: matchCustomConfig?.title || item.handle.title,
        breadcrumb:
          matchCustomConfig?.breadcrumb ||
          matchCustomConfig?.title ||
          item.handle.breadcrumb ||
          item.handle.title ||
          `(未知)`,
      })
    })

    return result
  }, [matchesRoutes, customBreadcrumb])

  return currentRoutes
}

export interface ICustomRoute {
  id: string
  link?: string
  title?: string
  breadcrumb: ReactNode
}

/** 面包屑导航专用的 route 栈 */
export function useCurrentBreadcrumbs(): ICustomRoute[] {
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
  const match = useMatch(path)
  const key = match?.pathnameBase

  useEffect(() => {
    if (key) {
      useRouterStore.getState().configCustomBreadcrumb(key, options)
    }

    return () => {
      if (key) {
        useRouterStore.getState().removeCustomBreadcrumb(key)
      }
    }
  }, [path, options, key])
}

/** 安装路由和网站 title 控制 */
export function useSetupRouter() {
  const navigate = useNavigate()
  const { setNavigate } = useRouterStore()

  useEffect(() => void setNavigate(navigate), [navigate, setNavigate])

  const routes = useCustomRouteStack()
  const routeWithTitle = routes.findLast(t => t.title)
  const title = routeWithTitle?.title

  useTitle(title ? `${title} | ${import.meta.env.VITE_WEBSITE_TITLE}` : `${import.meta.env.VITE_WEBSITE_TITLE}`)
}

/** 在任意位置导航 */
export const navigate: ReturnType<typeof useNavigate> = (...restProps) =>
  // @ts-expect-error 无法通过 any 类型处理
  useRouterStore.getState().navigate(...restProps)
