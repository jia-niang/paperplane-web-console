import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ConfigProvider, merge } from 'tdesign-react'
import 'tdesign-react/dist/reset.css'
import zhConfig from 'tdesign-react/es/locale/zh_CN'

import { router } from '@/router'
import { ensureClientId } from '@/utils/clientId'

import '@/styles/global.scss'
import '@/styles/tailwind.css'
import '@/styles/theme.scss'

dayjs.locale('zh-cn')

ensureClientId()

const globalConfig = merge(zhConfig, {})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const emotionCacheConfig = createCache({ key: 'paperplane-app-default', nonce: 'emotion' })

root.render(
  <ConfigProvider globalConfig={globalConfig}>
    <CacheProvider value={emotionCacheConfig}>
      <RouterProvider router={router} />
    </CacheProvider>
  </ConfigProvider>
)
