import loadable from '@loadable/component'

import PageLoading from '@/components/loading/PageLoading'

export type ILazyOptions = Parameters<typeof loadable>[1]

/** 懒加载页面的默认配置，会传递给 `@loadable/component` */
const lazyComponentDefaultOptions: ILazyOptions = {
  fallback: <PageLoading />,
}

/** 调用 `@loadable/component` 懒加载组件，预设了一些默认配置 */
export default function lazy(loadFn: any, options?: ILazyOptions) {
  const LazyComponent = loadable(loadFn, {
    ...lazyComponentDefaultOptions,
    ...options,
  })

  return <LazyComponent />
}
