import { MessageRobotType } from '@repo/db'
import { ReactNode, useState } from 'react'
import { SendIcon } from 'tdesign-icons-react'
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Space,
  SubmitContext,
  Switch,
  TagInput,
  Textarea,
  notification,
} from 'tdesign-react'

import { sendUnionRobotTextMessageApi } from '@/apis/robots'
import dingtalkRobotIcon from '@/assets/icon/robot-icons/logo-dingtalk.svg'
import feishukRobotIcon from '@/assets/icon/robot-icons/logo-feishu.svg'
import wechatbizRobotIcon from '@/assets/icon/robot-icons/logo-wechatbiz.svg'
import PageLayout from '@/components/layout/PageLayout'

import RobotToggler from './RobotToggler'
import useRobotRemeberConfig from './useRobotRemeberConfig'

const { FormItem } = Form

export interface IRobotTabConfig {
  type: MessageRobotType
  name: string
  icon: string
  tips?: ReactNode
}

const tabConfig: IRobotTabConfig[] = [
  {
    type: MessageRobotType.WXBIZ,
    name: '企业微信',
    icon: wechatbizRobotIcon,
    tips: '企业微信支持的消息：纯文字；支持使用手机号来 @ 群成员。其他消息类型支持正在开发中。',
    // tips: '企业微信支持的消息：纯文字、不带图片的 Markdown、单张图片；支持使用手机号来 @ 群成员。',
  },

  {
    type: MessageRobotType.DINGTALK,
    name: '钉钉',
    icon: dingtalkRobotIcon,
    tips: '钉钉支持的消息：纯文字；支持使用手机号来 @ 群成员。其他消息类型支持正在开发中。',
    // tips: '钉钉支持的消息：纯文字、带图片的 Markdown、单张图片；支持使用手机号来 @ 群成员。',
  },

  {
    type: MessageRobotType.FEISHU,
    name: '飞书',
    icon: feishukRobotIcon,
    tips: '飞书支持的消息：纯文字；暂不支持发图；暂不支持 @ 群成员（可以 @ 全体）。其他消息类型支持正在开发中。',
    // tips: '飞书支持的消息：纯文字、不带图片的 Markdown；暂不支持发图；暂不支持 @ 群成员（可以 @ 全体）。',
  },
]

/** 消息机器人 */
export default function RobotPage(): RC {
  const [remeberConfig, setRemeberConfig, resetRemeberConfig] = useRobotRemeberConfig()
  const [tab, setTab] = useState<IRobotTabConfig>(() =>
    remeberConfig.isRemeber ? tabConfig.find(t => t.type === remeberConfig.tabType)! : tabConfig[0]
  )

  const [form] = Form.useForm()
  const isAtAll = Form.useWatch('atAll', form)

  const [isLoading, setIsLoading] = useState(false)

  const submitMessageHandler = (result: SubmitContext) => {
    if (result.validateResult !== true) {
      return
    }

    setIsLoading(true)
    sendUnionRobotTextMessageApi(
      tab.type,
      form.getFieldValue('text') as string,
      {
        accessToken: form.getFieldValue('accessToken') as string,
        secret: form.getFieldValue('secret') as string,
      },
      form.getFieldValue('atList') as string[],
      form.getFieldValue('atAll') as boolean
    )
      .then(res => {
        if (res.errcode === 0 /** 企微/钉钉 */ || res.StatusCode === 0 /** 飞书 */) {
          notification.success({ title: '发送成功', content: '' })
          form.setFieldsValue({ text: '' })
        } else {
          notification.error({
            title: '发送失败',
            content: '请检查机器人设置是否有误，或稍后再试',
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <PageLayout>
      <RobotToggler
        value={tab}
        onChange={newTab => {
          setTab(newTab)
          setRemeberConfig(t => ({ ...t!, tabType: newTab.type }))
        }}
        tabConfig={tabConfig}
      />

      {tab.tips ? <Alert message={tab.tips} style={{ marginTop: 30 }} theme="info" /> : null}

      <Form
        form={form}
        onSubmit={submitMessageHandler}
        disabled={isLoading}
        labelWidth="120px"
        style={{ marginTop: 30 }}
        colon
      >
        <FormItem name="text" label="消息内容" rules={[{ required: true }]}>
          <Textarea placeholder="输入消息内容" />
        </FormItem>

        <FormItem
          name="accessToken"
          label="AccessToken"
          initialData={remeberConfig.isRemeber ? remeberConfig.accessToken : ''}
          rules={[{ required: true }]}
        >
          <Input
            placeholder="输入 AccessToken"
            onChange={v => void setRemeberConfig(t => ({ ...t!, accessToken: v }))}
          />
        </FormItem>

        {tab.type !== MessageRobotType.WXBIZ ? (
          <FormItem
            name="secret"
            label="secret"
            initialData={remeberConfig.isRemeber ? remeberConfig.secret : ''}
            rules={[{ required: true }]}
          >
            <Input placeholder="输入 secret" onChange={v => void setRemeberConfig(t => ({ ...t!, secret: v }))} />
          </FormItem>
        ) : null}

        <FormItem name="atAll" label="@ 全体">
          <Switch size="large" />
        </FormItem>

        {tab.type !== MessageRobotType.FEISHU && !isAtAll ? (
          <FormItem name="atList" label="@ 群成员">
            <TagInput placeholder="请输入需要 @ 的成员手机号，输入完请按 “Enter” 回车键" clearable />
          </FormItem>
        ) : null}
      </Form>

      <Space direction="vertical" className="mt-[30px] flex text-center">
        <Checkbox
          checked={remeberConfig.isRemeber}
          onChange={checked => {
            if (checked) {
              setRemeberConfig(t => ({ ...t!, isRemeber: checked }))
            } else {
              resetRemeberConfig()
            }
          }}
        >
          记住机器人配置
        </Checkbox>

        <Button
          onClick={() => void form.submit()}
          suffix={<SendIcon />}
          loading={isLoading}
          type="button"
          size="large"
          variant="base"
        >
          {isLoading ? '请等待…' : '发送消息'}
        </Button>
      </Space>
    </PageLayout>
  )
}
