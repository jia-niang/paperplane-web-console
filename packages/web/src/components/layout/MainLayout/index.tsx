import { Fragment } from 'react'
import { Outlet } from 'react-router'

import { useSetupRouter } from '@/services/routerService'

import PageHeader from './PageHeader'

export default function MainLayout(): RC {
  useSetupRouter()

  return (
    <Fragment>
      <PageHeader />
      <Outlet />
    </Fragment>
  )
}
