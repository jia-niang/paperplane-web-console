import { pick } from 'lodash-es'
import { ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@/components/layout/MainLayout'
import Page404 from '@/pages/fallbacks/page-404'
import HomePage from '@/pages/home'
import { traverseTree } from '@/utils/traverseTree'

import lazy from './lazy'

export type RouterHandleType = {
  /** 网页标题 */
  title?: string

  /** 覆盖面包屑导航中使用的标题 */
  breadcrumbTitle?: ReactNode
}

export type RouteObjectType = RouteObject &
  RouterHandleType & {
    children?: RouteObjectType[]
    handle?: RouterHandleType
  }

export const routerConfig: RouteObjectType[] = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: 'gpt',
        title: 'GPT 问答',
        element: lazy(() => import('@/pages/gpt')),
      },

      {
        path: 'robot',
        title: '消息机器人',
        element: lazy(() => import('@/pages/robot')),
      },

      { path: '404', title: '页面不见了', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]

traverseTree(routerConfig, item => {
  item.handle = { ...pick(item, ['title', 'breadcrumbTitle']), ...item.handle }
})

export const router = createBrowserRouter(routerConfig, { basename: import.meta.env.VITE_BASE_URL })
