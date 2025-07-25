import { MessageRobotType } from '@repo/db'
import { useMemo, useState } from 'react'
import {
  Alert,
  Col,
  Form,
  Input,
  Link,
  notification,
  Radio,
  Space,
  SubmitContext,
  Switch,
  TagInput,
  Textarea,
} from 'tdesign-react'

import { sendRobotImageApi, sendRobotMessageMarkdownApi, sendRobotMessageTextApi } from '@/apis/robots'
import FormOkButton from '@/components/buttons/small-form-buttons/FormOkButton'
import Title from '@/components/text/Title'

import { required } from '../common'
import UploadImage from '../components/UploadImage'

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

  const robotType: MessageRobotType = useWatch('type', robotForm)

  const [messageForm] = useForm()
  const atList: string[] = useWatch('atList', messageForm)
  const atAll: boolean = useWatch('atAll', messageForm)
  const messageType: RobotMessageType = useWatch('type', messageForm)

  const [loading, setLoading] = useState(false)

  const submitHandler = async (submit: SubmitContext) => {
    if (submit.validateResult !== true) {
      return
    }

    const { accessToken, secret, extraAuthentication } = robotForm.getFieldsValue(true)
    const robotValidate = await robotForm.validateOnly({ fields: ['accessToken', 'secret'] })

    if (robotValidate !== true) {
      notification.error({ title: '发送失败', content: '机器人配置输入有误，请检查修正后重试' })

      return
    }

    const messageData: any = messageForm.getFieldsValue(true)
    const authBody = { accessToken, secret, extraAuthentication }

    setLoading(true)
    try {
      if (messageData.type === RobotMessageType.TEXT) {
        await sendRobotMessageTextApi(robotType, authBody, messageData)
      } else if (messageData.type === RobotMessageType.MARKDOWN) {
        await sendRobotMessageMarkdownApi(robotType, authBody, messageData)
      } else if (messageData.type === RobotMessageType.IMAGE) {
        await sendRobotImageApi(robotType, authBody, messageData)
      }

      notification.success({ title: '已发送' })
      messageForm.reset()
    } finally {
      setLoading(false)
    }
  }

  const showAtAll = useMemo(() => {
    if (messageType === RobotMessageType.MARKDOWN && robotType === MessageRobotType.WXBIZ) {
      return false
    }
    return messageType !== RobotMessageType.IMAGE
  }, [messageType, robotType])

  return (
    <Col span={4}>
      <Form
        onSubmit={submitHandler}
        form={messageForm}
        disabled={loading}
        resetType="initial"
        layout="vertical"
        labelAlign="top"
        className="mb-6"
        colon
      >
        <Title className="mb-4">发送消息：</Title>

        <FormItem
          name="type"
          label="消息类型"
          initialData={messageType || RobotMessageType.TEXT}
          rules={required}
          help="后续版本更新会开放各种类型"
        >
          <Radio.Group variant="primary-filled">
            <Radio.Button value={RobotMessageType.TEXT}>文本</Radio.Button>
            <Radio.Button value={RobotMessageType.MARKDOWN}>Markdown</Radio.Button>
            <Radio.Button value={RobotMessageType.IMAGE}>图片</Radio.Button>
          </Radio.Group>
        </FormItem>

        {messageType === RobotMessageType.TEXT ? (
          <FormItem name="text" label="消息内容" rules={required} initialData="">
            <Textarea placeholder="请输入消息内容" />
          </FormItem>
        ) : null}

        {messageType === RobotMessageType.MARKDOWN ? (
          <>
            {robotType === MessageRobotType.DINGTALK ? (
              <FormItem
                name="title"
                label="钉钉通知标题"
                initialData=""
                help="仅用于钉钉通知，可留空，会自动从正文提取标题"
              >
                <Input />
              </FormItem>
            ) : robotType === MessageRobotType.FEISHU ? (
              <FormItem name="title" label="标题" initialData="" help="用于通知和标题，可留空，会自动从正文提取标题">
                <Input />
              </FormItem>
            ) : null}

            <FormItem name="markdown" label="消息 Markdown" initialData="" rules={required}>
              <Textarea placeholder="请输入消息 Markdown" />
            </FormItem>

            {robotType === MessageRobotType.WXBIZ ? (
              <>
                <Alert
                  style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                  theme="info"
                  title="支持的 Markdown 格式"
                  message={`基础格式：\n# 标题，**加粗**，[链接](url)，\`行内代码\`，> 引用\n\n支持颜色文字：\n<font color="info">文本</font>\n\n其中 color 取值 "info" 为绿色，取值 "comment" 为灰色，取值 "warning" 为橙红色。`}
                />
                <Alert
                  style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                  theme="error"
                  title="不支持的格式"
                  message={`无法使用“@”功能；不支持任何形式的图片。`}
                />
              </>
            ) : robotType === MessageRobotType.DINGTALK ? (
              <Alert
                style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                theme="info"
                title="支持的 Markdown 格式"
                message={`基础格式：\n# 标题，**加粗**，*斜体*，> 引用，[链接](url)，- 无序列表，1. 有序列表。\n\n支持插入图片：\n![](图片URL)`}
              />
            ) : robotType === MessageRobotType.FEISHU ? (
              <Alert
                style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                theme="error"
                title="关于飞书富文本消息"
                message="飞书原生不支持 Markdown 消息，提供的富文本消息仅支持超链接和“@用户”这两种语法。"
              />
            ) : null}
          </>
        ) : null}

        {messageType === RobotMessageType.IMAGE ? (
          <>
            <FormItem name="imageUrl" label="上传图片" rules={required} initialData="">
              <UploadImage />
            </FormItem>

            {robotType === MessageRobotType.DINGTALK ? (
              <>
                <FormItem name="title" label="钉钉通知标题" initialData="" help="仅用于钉钉通知，可留空">
                  <Input placeholder="默认 [图片]" />
                </FormItem>

                <Alert
                  style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                  theme="info"
                  title="关于发送图片"
                  message="钉钉机器人使用 Markdown 消息来实现发图，需提供 Markdown 标题，默认为“[图片]”。"
                />
              </>
            ) : robotType === MessageRobotType.WXBIZ ? (
              <Alert
                style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                theme="info"
                title="关于发送图片"
                message="企业微信只支持 png、jpg 格式图片，图片文件不能超过 2MB，如果文件过大会自动压缩。"
              />
            ) : robotType === MessageRobotType.FEISHU ? (
              <Alert
                style={{ padding: '12px', margin: '16px 0', whiteSpace: 'pre-wrap' }}
                theme="info"
                title="关于发送图片"
                message="此功能需飞书平台应用开通相关权限，并正确配置 AppId 和 AppSecret。"
              />
            ) : null}
          </>
        ) : null}

        {showAtAll ? (
          <FormItem
            name="atAll"
            label="@所有人"
            initialData={false}
            help={
              robotType === MessageRobotType.WXBIZ
                ? `消息末尾会“@所有人”且无法调整位置`
                : robotType === MessageRobotType.DINGTALK
                  ? `可通过消息中的“@all”来调整“@所有人”文本的位置，默认在消息的末尾；开启后无法“@用户”`
                  : `可通过消息中的“@all”来调整“@所有人”文本的位置，默认在消息的末尾`
            }
          >
            <Switch />
          </FormItem>
        ) : null}

        {!showAtAll ||
        ([MessageRobotType.DINGTALK, MessageRobotType.FEISHU].includes(robotType as any) && atAll) ? null : (
          <FormItem
            name="atList"
            label="@用户"
            initialData={[]}
            help="输入提及用户的手机号，按回车键完成输入，支持多个"
          >
            <TagInput placeholder="请输入手机号" clearable />
          </FormItem>
        )}

        {atList?.length > 0 && [MessageRobotType.DINGTALK, MessageRobotType.FEISHU].includes(robotType as any) ? (
          <Alert
            style={{ padding: '12px', margin: '16px 0' }}
            theme="info"
            title="关于“@用户”功能"
            message="默认“@用户XXX”会追加在消息末尾，可通过消息中的“@手机号”来调整文本的位置。"
          />
        ) : null}

        {atList?.length > 0 && robotType === MessageRobotType.FEISHU ? (
          <Alert
            style={{ padding: '12px', margin: '16px 0' }}
            theme="info"
            title="关于飞书相关权限"
            message="此功能需飞书平台应用开通相关权限，并正确配置 AppId 和 AppSecret。"
          />
        ) : null}
      </Form>

      <Space>
        <FormOkButton onClick={() => void messageForm.submit()} loading={loading}>
          发送消息
        </FormOkButton>

        <span>
          <Link
            theme="primary"
            size="small"
            target="_blank"
            href={
              robotType === MessageRobotType.DINGTALK
                ? `https://open.dingtalk.com/document/group/custom-robot-access`
                : robotType === MessageRobotType.FEISHU
                  ? `https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot`
                  : `https://developer.work.weixin.qq.com/document/path/99110`
            }
          >
            机器人技术文档
          </Link>
        </span>
      </Space>
    </Col>
  )
}
