import { MessageRobotType } from '@repo/db'
import { pick } from 'lodash-es'
import { ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router'

import MainLayout from '@/components/layout/MainLayout'
import Page404 from '@/pages/fallbacks/page-404'
import HomePage from '@/pages/home'
import { traverseTree } from '@/utils/traverseTree'

import lazy from './lazy'

export type RouteObjectType = RouteObject &
  RouterHandleType & {
    children?: RouteObjectType[]
    handle?: RouterHandleType
  }

export type RouterHandleType = {
  /** 网页标题 */
  title?: string

  /** 覆盖面包屑导航中使用的标题 */
  breadcrumbTitle?: ReactNode
}

const bizPage = lazy(() => import('@/pages/biz'))

export const routerConfig: RouteObjectType[] = [
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: 'gpt',
        title: 'GPT-4o',
        element: lazy(() => import('@/pages/gpt')),
      },

      { path: 'robot', element: <Navigate to={MessageRobotType.WXBIZ.toLowerCase()} replace /> },
      {
        path: 'robot/:robotType',
        title: 'OA 机器人',
        element: lazy(() => import('@/pages/robot')),
      },

      {
        path: 'biz/company/:companyId/workplace/:workplaceId',
        title: '公司/工作地',
        element: bizPage,
      },
      { path: 'biz/company/:companyId', title: '公司/工作地', element: bizPage },
      { path: 'biz', title: '公司/工作地', element: bizPage },

      { path: '404', title: '页面不见了', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]

traverseTree(routerConfig, item => {
  item.handle = { ...pick(item, ['title', 'breadcrumbTitle']), ...item.handle }
})

export const browserRouter = createBrowserRouter(routerConfig, { basename: import.meta.env.VITE_BASE_URL })
