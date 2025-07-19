import { Outlet } from 'react-router'
import { Col, Row } from 'tdesign-react'

import PageLayout from '@/components/layout/PageLayout'
import Title from '@/components/text/Title'

import RobotSelector from './components/RobotSelector'

/** 消息机器人 */
export default function RobotPage(): RC {
  return (
    <PageLayout>
      <Row gutter={25}>
        <Col span={4}>
          <Title>已存储的机器人：</Title>

          <RobotSelector />
        </Col>

        <Outlet />
      </Row>
    </PageLayout>
  )
}
