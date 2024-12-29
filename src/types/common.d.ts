/** 响应体 */
interface IResponseBody {
  success: boolean
  message: string
  code: number
}

/** 成功的响应 */
interface ISuccessBody<TData = unknown> extends IResponseBody {
  success: true
  data: TData
}

/** 出错的响应   */
interface IErrorBody<TData = void> extends IResponseBody {
  success: false
  data?: TData
}

/** 分页数据 */
interface IPaginated<TData = unknown> {
  total: number
  current: number
  list: TData[]
}

type TimestampType = number

/** 带有客户端 ID 的类型 */
interface IWithClientId {
  clientId?: string
}
