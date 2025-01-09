import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { SWRConfig } from 'swr'
import { ConfigProvider, merge } from 'tdesign-react'
import zhConfig from 'tdesign-react/es/locale/zh_CN'

import { browserRouter } from '@/router'
import { ensureClientId } from '@/utils/clientId'

import '@/styles/global.scss'
import '@/styles/tailwind.css'
import '@/styles/theme.scss'

dayjs.locale('zh-cn')

ensureClientId()

const globalConfig = merge(zhConfig, {})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const emotionCacheConfig = createCache({ key: 'paperplane-web-console-default', nonce: 'emotion' })

root.render(
  <SWRConfig value={{ refreshWhenHidden: false }}>
    <ConfigProvider globalConfig={globalConfig}>
      <CacheProvider value={emotionCacheConfig}>
        <RouterProvider router={browserRouter} />
      </CacheProvider>
    </ConfigProvider>
  </SWRConfig>
)
