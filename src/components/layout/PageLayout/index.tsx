export default function PageLayout(props: IProps): RC {
  return (
    <main {...props} className="mx-auto mb-8 w-[960px]">
      {props.children}
    </main>
  )
}
