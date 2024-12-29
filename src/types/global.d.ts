/** React 组件 */
type RC = ReturnType<React.FC>

/** 组件基础属性 */
interface IProps {
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

/** 获取数组的类型 */
type TypeofArray<T extends unknown[]> = T extends (infer U)[] ? U : never

/** 获取 Promise 的类型 */
type TypeofPromise<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never
