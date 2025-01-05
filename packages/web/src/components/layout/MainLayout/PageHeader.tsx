import { css } from '@emotion/react'
import { usePrevious } from 'ahooks'
import Atropos from 'atropos/react'
import { uniqBy } from 'lodash-es'
import { motion, AnimatePresence } from 'motion/react'
import { useMemo } from 'react'
import { NavLink, useLocation, useMatches, useNavigate } from 'react-router'
import { HomeIcon } from 'tdesign-icons-react'
import { Breadcrumb, Link, Space } from 'tdesign-react'

import UserToolbar from '@/components/user/UserToolbar'

import { usePageHeader } from './usePageHeader'

const { BreadcrumbItem } = Breadcrumb

export default function PageHeader(): RC {
  const navigate = useNavigate()

  const routerForBreadcrumbItem = useMemo(() => ({ push: navigate }), [navigate])

  const location = useLocation()
  const isHomepage = location.pathname === '/'

  const currentRoutes = uniqBy(useMatches(), 'pathname')
  const lastRoutes = usePrevious(currentRoutes) || currentRoutes
  const navRoutes = isHomepage ? lastRoutes : currentRoutes

  const pageHeader = usePageHeader()

  const breadcrumb = (
    <Breadcrumb key="_breadcrumb" className="justify-center py-[10px]" maxItemWidth="120px">
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
            {route.pathname === '/' ? null : route.handle?.breadcrumbTitle || route.handle?.title || '(未知)'}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )

  return (
    <header>
      <div className="mx-auto w-[960px] pb-8">
        <div className="flex h-[60px] items-center">
          <Space>
            <Link size="large" theme="primary" href="/">
              Web Console
            </Link>
            <Link
              size="large"
              theme="default"
              href="https://git.paperplane.cc/jia-niang/paperplane-web-console"
              target="_blank"
            >
              源码
            </Link>
            <Link
              size="large"
              theme="default"
              href="https://drone.paperplane.cc/jia-niang/paperplane-web-console"
              target="_blank"
            >
              CI/CD
            </Link>
            <Link size="large" theme="default" href="https://paperplane.cc/a" target="_blank">
              全站导航
            </Link>
          </Space>

          <UserToolbar className="ml-auto" />
        </div>

        <div
          css={css`
            position: relative;
            display: flex;
            flex-wrap: wrap;
            margin: 0 auto;
            border-radius: 6px;
            justify-content: center;
            align-items: center;
            background: #d46d72;
            background-image: linear-gradient(90deg, #963db3, #bf3caf, #e3419e, #fe4b83, #ff5e64, #ff7747);

            /* 顶部三角条 */
            &::before {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              top: -10px;
              height: 10px;
              clip-path: polygon(50px 0, 40px 100%, 60px 100%);
              background: #d46d72;
              background-image: linear-gradient(90deg, #963db3, #bf3caf, #e3419e, #fe4b83, #ff5e64, #ff7747);
            }
          `}
        >
          <Atropos
            shadow={false}
            duration={150}
            activeOffset={10}
            highlight={false}
            css={css`
              display: inline-block;
              width: 960px;
              height: 120px;
              display: inline-block;
              text-align: center;
              padding: 0 20px;
              color: #fff;
              user-select: none;
            `}
          >
            <motion.div
              key="title"
              initial={{
                fontFamily: 'swift',
                fontSize: '50px',
                lineHeight: '50px',
                margin: '35px 0 35px',
              }}
              animate={
                isHomepage && !pageHeader.toolbar
                  ? undefined
                  : {
                      fontSize: '40px',
                      lineHeight: '40px',
                      margin: '18px 0 8px',
                    }
              }
            >
              <NavLink to="/">PaperPlane Web Console</NavLink>
            </motion.div>

            <AnimatePresence>
              {pageHeader.toolbar ? (
                <motion.div
                  className="overflow-hidden"
                  initial={{ maxHeight: '0px' }}
                  animate={{ maxHeight: '60px' }}
                  exit={{ maxHeight: '0px' }}
                >
                  {pageHeader.toolbar}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {breadcrumb}
          </Atropos>
        </div>
      </div>
    </header>
  )
}
