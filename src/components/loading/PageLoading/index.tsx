import { css } from '@emotion/react'
import { Skeleton } from 'tdesign-react'

import PageLayout from '@/components/layout/PageLayout'

export default function PageLoading(): RC {
  return (
    <PageLayout
      css={css`
        padding: 20px 0;
        text-align: center;
      `}
    >
      <Skeleton theme="article">{}</Skeleton>
    </PageLayout>
  )
}
