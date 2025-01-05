import { useTitle } from 'ahooks'
import { last } from 'lodash-es'
import { Fragment } from 'react'
import { Outlet, useMatches } from 'react-router'

import PageHeader from './PageHeader'

export default function MainLayout(): RC {
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
