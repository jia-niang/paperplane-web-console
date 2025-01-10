import { useTitle } from 'ahooks'
import { last } from 'lodash-es'
import { Fragment, useEffect } from 'react'
import { Outlet, useMatches, useNavigate } from 'react-router'

import { useRouterStore } from '@/services/routerService'

import PageHeader from './PageHeader'

export default function MainLayout(): RC {
  const navigate = useNavigate()
  const { setNavigate } = useRouterStore()

  useEffect(() => void setNavigate(navigate), [navigate, setNavigate])

  const currentRoute = last(useMatches())
  const routeMeta = currentRoute?.handle

  useTitle(
    routeMeta?.title
      ? `${routeMeta?.title} | ${import.meta.env.VITE_WEBSITE_TITLE}`
      : `${import.meta.env.VITE_WEBSITE_TITLE}`
  )

  return (
    <Fragment>
      <PageHeader />
      <Outlet />
    </Fragment>
  )
}
