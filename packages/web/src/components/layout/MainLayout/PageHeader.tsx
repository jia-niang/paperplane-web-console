import Atropos from 'atropos/react'
import { motion, AnimatePresence } from 'motion/react'
import { NavLink, useLocation } from 'react-router'
import { Link, Space } from 'tdesign-react'

import UserToolbar from '@/components/user/UserToolbar'

import CustomBreadcrumb from './CustomBreadcrumb'
import { usePageHeader } from './usePageHeader'

import './PageHeader.scss'

export default function PageHeader(): RC {
  const location = useLocation()
  const isHomepage = location.pathname === '/'

  const pageHeader = usePageHeader()

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

        <div className="header__headerbar">
          <Atropos
            shadow={false}
            duration={150}
            activeOffset={10}
            highlight={false}
            className="header__headerbar__atropos"
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

            <CustomBreadcrumb />
          </Atropos>
        </div>
      </div>
    </header>
  )
}
