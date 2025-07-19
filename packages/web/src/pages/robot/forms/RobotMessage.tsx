import { useState } from 'react'
import { Col, Form, notification, Radio, Space, SubmitContext, Switch, TagInput, Textarea } from 'tdesign-react'

import { universalSendRobotTextMessageApi } from '@/apis/robots'
import FormOkButton from '@/components/buttons/small-form-buttons/FormOkButton'
import Title from '@/components/text/Title'

import { required } from '../common'

enum RobotMessageType {
  TEXT = 'text',
  MARKDOWN = 'markdown',
  IMAGE = 'image',
}

const { FormItem, useForm, useWatch } = Form

export interface IRobotMessageProps {
  robotForm: ReturnType<typeof Form.useForm>[0]
}

export default function RobotMessage(props: IRobotMessageProps): RC {
  const { robotForm } = props

  const [messageForm] = useForm()
  const isAtAll = useWatch('atAll', messageForm)

  const [loading, setLoading] = useState(false)

  const submitHandler = async (submit: SubmitContext) => {
    if (submit.validateResult !== true) {
      return
    }

    const { type, accessToken, secret } = robotForm.getFieldsValue(true)
    const robotValidate = await robotForm.validateOnly({ fields: ['accessToken', 'secret'] })
    if (!robotValidate) {
      notification.error({ title: '发送失败', content: '机器人配置输入有误，请检查修正后重试' })

      return
    }

    const messageData = messageForm.getFieldsValue(true)
    const authBody = { accessToken, secret }

    setLoading(true)
    try {
      if (messageData.type === RobotMessageType.TEXT) {
        await universalSendRobotTextMessageApi(
          type,
          messageData.content,
          authBody,
          messageData.atList,
          messageData.atAll
        )
      }

      notification.success({ title: '已发送' })
      messageForm.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Col span={4}>
      <Form
        onSubmit={submitHandler}
        form={messageForm}
        resetType="initial"
        disabled={loading}
        layout="vertical"
        labelAlign="top"
        className="mb-6"
        colon
      >
        <Title className="mb-4">发送消息：</Title>

        <FormItem
          name="type"
          label="消息类型"
          initialData={RobotMessageType.TEXT}
          help="目前仅支持文本，请等待后续更新"
          rules={required}
        >
          <Radio.Group variant="primary-filled">
            <Radio.Button value={RobotMessageType.TEXT}>文本</Radio.Button>
            <Radio.Button value={RobotMessageType.MARKDOWN} disabled>
              Markdown
            </Radio.Button>
            <Radio.Button value={RobotMessageType.IMAGE} disabled>
              图片
            </Radio.Button>
          </Radio.Group>
        </FormItem>

        <FormItem name="content" label="消息内容" rules={required}>
          <Textarea placeholder="输入消息内容" />
        </FormItem>

        {isAtAll ? null : (
          <FormItem name="atList" label="@用户" help="输入 @ 用户的手机号，按回车键完成输入，支持多个">
            <TagInput placeholder="请输入手机号" />
          </FormItem>
        )}

        <FormItem name="atAll" label="@所有人">
          <Switch />
        </FormItem>
      </Form>

      <Space>
        <FormOkButton onClick={() => void messageForm.submit()} loading={loading}>
          发送消息
        </FormOkButton>
      </Space>
    </Col>
  )
}
