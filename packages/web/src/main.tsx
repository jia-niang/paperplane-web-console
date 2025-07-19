import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { SWRConfig } from 'swr'
import { ConfigProvider, merge } from 'tdesign-react'
import zhConfig from 'tdesign-react/es/locale/zh_CN'

import { browserRouter } from '@/router/routes'
import { ensureClientId } from '@/utils/clientId'

import '@/styles/global.scss'

dayjs.locale('zh-cn')
ensureClientId()

const globalConfig = merge(zhConfig, {})
const emotionCacheConfig = createCache({ key: 'paperplane-web-console-default', nonce: 'emotion' })

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <SWRConfig value={{ refreshWhenHidden: false }}>
    <CacheProvider value={emotionCacheConfig}>
      <ConfigProvider globalConfig={globalConfig}>
        <RouterProvider router={browserRouter} />
      </ConfigProvider>
    </CacheProvider>
  </SWRConfig>
)
