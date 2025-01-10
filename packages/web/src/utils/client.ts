import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import { notification } from 'tdesign-react'

import { navigate } from '@/services/routerService'
import { useUserStore } from '@/services/userService'

/** 完全原始的 axios client */
const rawClient = axios.create()

const axiosPureConfig: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
}

/** 纯净版 client，只提供了默认配置，不使用拦截器 */
const pureClient = axios.create(axiosPureConfig)
pureClient.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

/** 自定义追加的 axios 请求配置 */
interface IAxiosRequestConfigExtend {
  /** 设为 `true` 可以禁用全局错误响应提示，默认 `false` */
  quiet?: boolean
}

interface IAxiosRequestConfig<P = any> extends AxiosRequestConfig<P>, IAxiosRequestConfigExtend {}

const axiosDefaultConfig: CreateAxiosDefaults & IAxiosRequestConfigExtend = {
  ...axiosPureConfig,
  quiet: false,
}

/**
 * 默认的 axios client
 *
 * 注意：此拦截器会自动取出响应的 `data` 字段，因此不需要 `.then(res => res.data)` 这样的操作
 * 因此它无法直接获取响应的 `header` 头等数据，此情况请使用 `pureClient()`，它没有配置拦截器
 */
export interface IAxiosClient extends AxiosInstance {
  request<R = any, P = any>(config: IAxiosRequestConfig<P>): Promise<R>

  get<R = any, P = any>(url: string, config?: IAxiosRequestConfig<P>): Promise<R>
  delete<R = any, P = any>(url: string, config?: IAxiosRequestConfig<P>): Promise<R>
  head<R = any, P = any>(url: string, config?: IAxiosRequestConfig<P>): Promise<R>
  options<R = any, P = any>(url: string, config?: IAxiosRequestConfig<P>): Promise<R>

  post<R = any, P = any>(url: string, data?: P, config?: IAxiosRequestConfig<P>): Promise<R>
  put<R = any, P = any>(url: string, data?: P, config?: IAxiosRequestConfig<P>): Promise<R>
  patch<R = any, P = any>(url: string, data?: P, config?: IAxiosRequestConfig<P>): Promise<R>

  postForm<R = any, P = any>(url: string, data?: P, config?: IAxiosRequestConfig<P>): Promise<R>
  putForm<R = any, P = any>(url: string, data?: P, config?: IAxiosRequestConfig<P>): Promise<R>
  patchForm<R = any, P = any>(url: string, data?: P, config?: IAxiosRequestConfig<P>): Promise<R>
}

const client: IAxiosClient = axios.create(axiosDefaultConfig)
client.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

/** 处理错误响应 */
function errorResponseHandler(error?: AxiosResponse<IErrorBody<any>> | AxiosError) {
  if (typeof (error as AxiosResponse<IErrorBody>)?.data?.message === 'string') {
    // 常规后端错误
    notification.error({
      title: '发生错误',
      content: (error as AxiosResponse<IErrorBody>)?.data?.message,
    })
  } else if (typeof (error as AxiosError)?.message === 'string') {
    // 服务器错误，例如 Nginx 层就报错了，请求未达后端
    notification.error({
      title: '发生错误',
      content: (error as AxiosError)?.message,
    })
  }

  if ((error as AxiosResponse<IErrorBody>)?.data?.code === 401) {
    // 401 错误，自动注销
    navigate(`/`)
    useUserStore.getState().logout()
  }
}

// 拦截器配置
client.interceptors.response.use(
  function (response: AxiosResponse) {
    const config: IAxiosRequestConfig = response.config
    const { quiet } = config

    const reponseBody: IResponseBody = response.data

    // 如果响应的 body 不为对象，此处不认为是错误，直接返回
    if (typeof reponseBody !== 'object') {
      return Promise.resolve(reponseBody)
    }

    // 处理业务错误
    if (reponseBody.success === false) {
      if (!quiet) {
        errorResponseHandler(response)
      }

      return Promise.reject(reponseBody)
    }

    return Promise.resolve((reponseBody as ISuccessBody)?.data || null) as any
  },

  // 处理原生请求错误
  function (error: AxiosError<IErrorBody>) {
    const config: IAxiosRequestConfig | undefined = error.config
    const { quiet } = config || axiosDefaultConfig

    if (!quiet) {
      errorResponseHandler(error)
    }

    return Promise.reject({
      success: false,
      data: error?.response?.data,
      message: error?.message,
      code: error?.response?.status,
    })
  }
)

export { rawClient, pureClient, client }
