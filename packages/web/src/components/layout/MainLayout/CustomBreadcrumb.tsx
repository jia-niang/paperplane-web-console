import { css } from '@emotion/react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { HomeIcon } from 'tdesign-icons-react'
import { Breadcrumb } from 'tdesign-react'

import { useCurrentBreadcrumbs } from '@/services/routerService'

const { BreadcrumbItem } = Breadcrumb

export default function CustomBreadcrumb(): RC {
  const navigate = useNavigate()
  const routerForBreadcrumbItem = useMemo(() => ({ push: navigate }), [navigate])

  const breadcrumbs = useCurrentBreadcrumbs()

  return (
    <Breadcrumb className="justify-center py-[10px]" maxItemWidth="120px">
      {breadcrumbs.map(item => {
        return (
          <BreadcrumbItem
            key={item.id}
            to={item.link}
            icon={item.link === '/' ? <HomeIcon size="20px" /> : undefined}
            router={routerForBreadcrumbItem}
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
            {item.link === '/' ? null : item.breadcrumb}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
