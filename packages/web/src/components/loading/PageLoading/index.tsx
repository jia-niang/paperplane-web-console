import { Skeleton } from 'tdesign-react'

import PageLayout from '@/components/layout/PageLayout'

export default function PageLoading(): RC {
  return (
    <PageLayout className="py-20 text-center">
      <Skeleton delay={250} theme="article"></Skeleton>
    </PageLayout>
  )
}
