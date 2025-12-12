import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { HomeIcon } from 'tdesign-icons-react'
import { Breadcrumb } from 'tdesign-react'

import { useCurrentBreadcrumbs } from '@/services/routerService'

import './CustomBreadcrumb.scss'

const { BreadcrumbItem } = Breadcrumb

export default function CustomBreadcrumb(): RC {
  const navigate = useNavigate()
  const routerForBreadcrumbItem = useMemo(() => ({ push: navigate }), [navigate])

  const breadcrumbs = useCurrentBreadcrumbs()

  return (
    <Breadcrumb className="header__breadcrumb justify-center pt-[10px]" maxItemWidth="120px">
      {breadcrumbs.map(item => {
        return (
          <BreadcrumbItem
            key={item.id}
            to={item.link}
            icon={item.link === '/' ? <HomeIcon size="20px" /> : undefined}
            router={routerForBreadcrumbItem}
            className="header__breadcrumb__item text-[20px] leading-[20px] text-[#fff]"
          >
            {item.link === '/' ? null : item.breadcrumb}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}
