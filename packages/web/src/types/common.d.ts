/** 带有客户端 ID 的类型 */
interface IWithClientId {
  clientId?: string
}

/** React 组件 */
type RC = ReturnType<React.FC>

/** 组件基础属性 */
interface IProps {
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}
