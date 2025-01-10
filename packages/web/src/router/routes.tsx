import { MessageRobotType } from '@repo/db'
import { ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router'

import MainLayout from '@/components/layout/MainLayout'
import Page404 from '@/pages/fallbacks/page-404'
import HomePage from '@/pages/home'
import { handleRouteTree } from '@/services/routerService'

import lazy from './lazy'

export type RouteObjectType = RouteObject &
  RouterHandleType & {
    children?: RouteObjectType[]
    handle?: RouterHandleType
  }

export type RouterHandleType = {
  /** 网页标题 */
  title?: string

  /** 覆写面包屑导航 */
  breadcrumb?: ReactNode
}

const bizPage = lazy(() => import('@/pages/biz'))
const bizCompanyPage = lazy(() => import('@/pages/biz/forms/CompamyForm'))
const bizWorkplacePage = lazy(() => import('@/pages/biz/forms/WorkplaceForm'))

const routerConfig: RouteObjectType[] = handleRouteTree([
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
        path: 'biz',
        title: '公司/工作地',
        element: bizPage,
        children: [
          {
            path: 'company/:companyId',
            breadcrumb: '公司',
            element: bizCompanyPage,
            children: [
              {
                path: 'workplace/:workplaceId',
                breadcrumb: '工作地',
                element: bizWorkplacePage,
              },
            ],
          },
        ],
      },

      { path: '404', title: '页面不见了', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
])

export const browserRouter = createBrowserRouter(routerConfig, { basename: import.meta.env.VITE_BASE_URL })
