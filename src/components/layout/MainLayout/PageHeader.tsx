import { css } from '@emotion/react'
import 'atropos/css'
import Atropos from 'atropos/react'
import { uniqBy } from 'lodash-es'
import { useLocation, useMatches, useNavigate } from 'react-router-dom'
import { HomeIcon } from 'tdesign-icons-react'
import { Breadcrumb, Link, Space } from 'tdesign-react'

import { RouterHandleType, router } from '@/router'

import '@/styles/fonts/font-title/index.scss'

const { BreadcrumbItem } = Breadcrumb

const currentYear = new Date().getFullYear()

export default function PageHeader(): RC {
  const location = useLocation()
  const navigate = useNavigate()

  const routerForBreadcrumbItem = { push: navigate }

  const currentRoutes = uniqBy(useMatches(), 'pathname')

  const homepageCopyright = `PaperPlane.cc © ${currentYear}`

  const breadcrumb = (
    <Breadcrumb maxItemWidth="120px">
      {currentRoutes.map(route => {
        if (route.pathname === '/') {
          return (
            <BreadcrumbItem key={route.id} icon={<HomeIcon />} router={routerForBreadcrumbItem} to="/"></BreadcrumbItem>
          )
        }

        const handle = route.handle as RouterHandleType | undefined
        const title = handle?.breadcrumbTitle || handle?.title || '(未知)'

        return (
          <BreadcrumbItem key={route.id} router={routerForBreadcrumbItem} to={route.pathname}>
            {title}
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
              工具箱
            </Link>
            <Link size="large" theme="default" href="https://paperplane.cc/" target="_blank">
              博客
            </Link>
            <Link size="large" theme="default" href="https://tl.paperplane.cc/" target="_blank">
              动态
            </Link>
            <Link
              size="large"
              theme="default"
              href="https://git.paperplane.cc/jia-niang/paperplane-app"
              target="_blank"
            >
              源码
            </Link>
            <Link
              size="large"
              theme="default"
              href="https://drone.paperplane.cc/jia-niang/paperplane-app"
              target="_blank"
            >
              CI/CD
            </Link>
            <Link size="large" theme="default" href="https://paperplane.cc/a" target="_blank">
              全站导航
            </Link>
          </Space>

          <div
            css={css`
              margin-left: auto;
              padding: 18px 0;
              cursor: default;
              font: var(--td-font-link-large);
              color: var(--td-gray-color-6);
            `}
          >
            {location.pathname === '/' ? homepageCopyright : breadcrumb}
          </div>
        </div>

        <div
          css={css`
            position: relative;
            display: flex;
            height: 120px;
            margin: 0 auto;
            border-radius: 6px;
            justify-content: center;
            align-items: center;
            background: #d46d72;
            background-image: linear-gradient(90deg, #963db3, #bf3caf, #e3419e, #fe4b83, #ff5e64, #ff7747);

            &::before {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              top: -10px;
              height: 10px;
              clip-path: polygon(26px 0, 16px 100%, 36px 100%);
              background: #d46d72;
              background-image: linear-gradient(90deg, #963db3, #bf3caf, #e3419e, #fe4b83, #ff5e64, #ff7747);
            }
          `}
        >
          <Atropos
            shadow={false}
            duration={150}
            activeOffset={30}
            highlight={false}
            onClick={() => void router.navigate('/')}
            css={css`
              display: inline-block;
              width: 960px;
              height: 120px;
              cursor: pointer;
              font-family: font-title;
              font-style: italic;
              display: inline-block;
              text-align: center;
              padding: 0 20px;
              font-size: 50px;
              color: #fff;
              line-height: 120px;
              user-select: none;
            `}
          >
            纸飞机/工具箱
          </Atropos>
        </div>
      </div>
    </header>
  )
}
