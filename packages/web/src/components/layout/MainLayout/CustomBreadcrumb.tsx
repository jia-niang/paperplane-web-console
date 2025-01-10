import { css } from '@emotion/react'
import { usePrevious } from 'ahooks'
import { uniqBy } from 'lodash-es'
import { useMemo } from 'react'
import { useLocation, useMatches, useNavigate } from 'react-router'
import { HomeIcon } from 'tdesign-icons-react'
import { Breadcrumb } from 'tdesign-react'

const { BreadcrumbItem } = Breadcrumb

function handleRoutes(routes: ReturnType<typeof useMatches>) {
  return uniqBy(routes, 'pathname')
}

export default function CustomBreadcrumb(): RC {
  const location = useLocation()
  const navigate = useNavigate()

  const routerForBreadcrumbItem = useMemo(() => ({ push: navigate }), [navigate])

  const matchesRoutes = useMatches()
  const currentRoutes = useMemo(() => handleRoutes(matchesRoutes), [matchesRoutes])

  const isHomepage = location.pathname === '/'
  const lastRoutes = usePrevious(currentRoutes) || currentRoutes
  const navRoutes = isHomepage ? lastRoutes : currentRoutes

  return (
    <Breadcrumb className="justify-center py-[10px]" maxItemWidth="120px">
      {navRoutes.map(route => {
        return (
          <BreadcrumbItem
            key={route.id}
            router={routerForBreadcrumbItem}
            to={route.pathname}
            icon={route.pathname === '/' ? <HomeIcon size="20px" /> : undefined}
            css={css`
              font-size: 20px;
              line-height: 20px;
              color: #fff;
              &:last-child,
              .t-breadcrumb__inner,
              .t-breadcrumb__inner-text,
              .t-breadcrumb__inner:active,
              .t-link:hover,
              .t-breadcrumb__separator .t-icon,
              .t-breadcrumb__inner:hover {
                color: #fff;
                font-size: 20px;
                line-height: 20px;
                animation: none;
              }
            `}
          >
            {route.pathname === '/' ? null : route.handle?.breadcrumb?.overrideTitle || route.handle?.title || '(未知)'}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
