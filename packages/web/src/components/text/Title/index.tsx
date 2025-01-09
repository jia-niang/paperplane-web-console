import clsx from 'clsx'

export interface ITitleProps extends IProps {}

export default function Title(props: ITitleProps): RC {
  const { className, style, children } = props

  return (
    <h1 className={clsx(className, 'font-serif text-2xl text-[var(--td-text-color-primary)]')} style={style}>
      {children}
    </h1>
  )
}
