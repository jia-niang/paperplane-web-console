import { Skeleton } from 'tdesign-react'

export default function PageLoading(): RC {
  return <Skeleton className="mx-auto max-w-[960px]" delay={250} theme="article"></Skeleton>
}
