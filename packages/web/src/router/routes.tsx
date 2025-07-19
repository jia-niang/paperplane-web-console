import { ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router'

import MainLayout from '@/components/layout/MainLayout'
import BizLoading from '@/pages/biz/loading'
import Page404 from '@/pages/fallbacks/page-404'
import HomePage from '@/pages/home'
import RobotLoading from '@/pages/robot/loading'
import { ROBOT_ADD_URL } from '@/services/robotService'
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

      { path: 'robot', element: <Navigate to={`/robot/${ROBOT_ADD_URL}`} replace /> },
      {
        path: 'robot',
        title: 'OA 机器人',
        element: lazy(() => import('@/pages/robot')),
        children: [
          {
            path: `${ROBOT_ADD_URL}`,
            breadcrumb: '新的机器人',
            element: lazy(() => import('@/pages/robot/forms/RobotForm'), { fallback: <RobotLoading /> }),
          },
          {
            path: `:storageType/:companyId/robots/:robotId`,
            element: lazy(() => import('@/pages/robot/forms/RobotForm'), { fallback: <RobotLoading /> }),
          },
          {
            path: `:storageType/:robotId`,
            element: lazy(() => import('@/pages/robot/forms/RobotForm'), { fallback: <RobotLoading /> }),
          },
        ],
      },

      {
        path: 'biz',
        title: '公司/工作地',
        element: lazy(() => import('@/pages/biz')),
        children: [
          {
            path: 'company/:companyId',
            breadcrumb: '公司',
            element: lazy(() => import('@/pages/biz/forms/CompamyForm'), { fallback: <BizLoading /> }),
            children: [
              {
                path: 'workplace/:workplaceId',
                breadcrumb: '工作地',
                element: lazy(() => import('@/pages/biz/forms/WorkplaceForm'), { fallback: <BizLoading /> }),
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
