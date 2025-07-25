import { MessageRobotType, Role } from '@repo/db'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { mutate } from 'swr'
import { Alert, Col, Form, Input, Radio, Select, Space, SubmitContext, Textarea } from 'tdesign-react'

import {
  addCompanyRobotApi,
  addUserRobotApi,
  deleteCompanyRobotApi,
  deleteUserRobotApi,
  editCompanyRobotApi,
  editUserRobotApi,
} from '@/apis/robots'
import FormCancelButton from '@/components/buttons/small-form-buttons/FormCancelButton'
import FormDeleteButton from '@/components/buttons/small-form-buttons/FormDeleteButton'
import FormEditButton from '@/components/buttons/small-form-buttons/FormEditButton'
import FormOkButton from '@/components/buttons/small-form-buttons/FormOkButton'
import Title from '@/components/text/Title'
import { useAllCompaniesSWR } from '@/services/bizService'
import { RobotStorageType, useLocalRobots } from '@/services/robotService'
import { useCustomRoute } from '@/services/routerService'
import { useAccess, useCurrentUser } from '@/services/userService'

import { robotEmitter, MessageRobotFormData, required, useRobotEditForm } from '../common'
import RobotMessage from './RobotMessage'

const dingtalkPrefix = 'https://oapi.dingtalk.com/robot/send?access_token='
const feishuPrefix = 'https://open.feishu.cn/open-apis/bot/v2/hook/'
const wxbizPrefix = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='

const { FormItem, useForm, useWatch } = Form

const robotTipsMap: Record<MessageRobotType, ReactNode> = {
  [MessageRobotType.DINGTALK]: <>群管理 → 添加机器人 → 自定义；安全设置仅支持“加签”。</>,
  [MessageRobotType.FEISHU]: <>群机器人 → 添加 → 自定义机器人；安全设置仅支持“签名校验”。</>,
  [MessageRobotType.WXBIZ]: <>群设置 → 添加群机器人 → 新创建。</>,
}

/** OA 机器人发送表单 */
export default function RobotForm(): RC {
  const [loading, setLoading] = useState(false)

  const { robot, lock, setLock, isAddRobot, storageType, select, companyId, robotId, toAddForm, setRobot } =
    useRobotEditForm()
  const currentUser = useCurrentUser()
  const isStaff = useAccess(Role.STAFF)

  const { addLocalRobot, editLocalRobot, deleteLocalRobot } = useLocalRobots()

  const [robotForm] = useForm()
  const robotType: MessageRobotType = useWatch('type', robotForm)
  const robotStorageType: RobotStorageType = useWatch('__storageType', robotForm)

  const { data: companyList } = useAllCompaniesSWR()
  const companyOptions = useMemo(() => companyList?.map(c => ({ label: c.company, value: c.id })), [companyList])

  useCustomRoute(`/robot/:storageType/:robotId`, {
    insertBeforeBreadcrumbs: [
      {
        breadcrumb: {
          [RobotStorageType.LOCAL]: '本地',
          [RobotStorageType.USER]: '我的',
          [RobotStorageType.COMPANY]: '公司',
        }[storageType!],
      },
    ],
    breadcrumb: robot?.name,
  })

  const companyName = useMemo(
    () => companyList?.find(t => t.id === robot.companyId)?.company || '',
    [companyList, robot.companyId]
  )
  useCustomRoute(`/robot/:storageType/:companyId/robots/:robotId`, {
    insertBeforeBreadcrumbs: [{ breadcrumb: companyName }],
    breadcrumb: robot?.name,
  })

  const submitHandler = async (submit: SubmitContext) => {
    if (submit.validateResult !== true) {
      return
    }

    const robotFormResult = robotForm.getFieldsValue(true) as MessageRobotFormData

    if (isAddRobot) {
      await addRobotHandler(robotFormResult)
    } else {
      await editRobotHandler(robotFormResult)
    }
  }

  const robotRefresh = async (type: RobotStorageType, companyId?: string, robotId?: string) => {
    if (type === RobotStorageType.USER) {
      await mutate(`/message-robot/current`)
      await mutate(`/message-robot/current/${robotId}`)
    } else if (type === RobotStorageType.COMPANY) {
      await mutate(`/message-robot/company/${companyId}/robot`)
      await mutate(`/message-robot/current/${companyId}/robot/${robotId}`)
      robotEmitter.emit('companyRefresh', companyId!)
    }
  }

  const addRobotHandler = async (robotFormResult: MessageRobotFormData) => {
    const { __storageType, __companyId, ...robotData } = robotFormResult

    setLoading(true)
    try {
      const newRobot =
        __storageType === RobotStorageType.LOCAL
          ? addLocalRobot(robotData)
          : __storageType === RobotStorageType.USER
            ? await addUserRobotApi(robotData)
            : await addCompanyRobotApi(__companyId!, robotData)

      await robotRefresh(__storageType!, companyId, newRobot.id)

      select(__storageType!, __companyId || null, newRobot.id)
    } finally {
      setLoading(false)
    }
  }

  const editRobotHandler = async (robotFormResult: MessageRobotFormData) => {
    const { __storageType, __companyId, ...robotData } = robotFormResult

    setLoading(true)
    try {
      const newRobot =
        __storageType === RobotStorageType.LOCAL
          ? editLocalRobot(robotData)
          : __storageType === RobotStorageType.USER
            ? await editUserRobotApi(robotData)
            : await editCompanyRobotApi(__companyId!, robotData)

      await robotRefresh(__storageType!, companyId, newRobot.id)

      setRobot({ ...newRobot, __storageType, __companyId })
    } finally {
      setLock(true)
      setLoading(false)
    }
  }

  useEffect(() => void robotForm.reset(), [robot, robotForm])

  return (
    <>
      <Col span={4}>
        <Form
          initialData={robot}
          form={robotForm}
          onSubmit={submitHandler}
          resetType="initial"
          layout="vertical"
          labelAlign="top"
          className="mb-8"
          disabled={lock || loading}
          colon
        >
          <Title className="mb-4">机器人配置：</Title>

          {!isAddRobot ? (
            <FormItem name="id" label="机器人 ID" rules={required}>
              <Input disabled />
            </FormItem>
          ) : null}

          <FormItem name="name" label="机器人名称" rules={required}>
            <Input autocomplete="one-time-code" />
          </FormItem>

          <FormItem name="type" label="类别" rules={required}>
            <Radio.Group variant="primary-filled">
              <Radio.Button value={MessageRobotType.WXBIZ}>企业微信</Radio.Button>
              <Radio.Button value={MessageRobotType.DINGTALK}>钉钉</Radio.Button>
              <Radio.Button value={MessageRobotType.FEISHU}>飞书</Radio.Button>
            </Radio.Group>
          </FormItem>

          {isAddRobot ? (
            <Alert
              style={{ padding: '12px', margin: '16px 0' }}
              theme="info"
              title="配置指南"
              message={robotTipsMap[robotType]}
            />
          ) : null}

          <FormItem
            name="accessToken"
            label="Webhook 令牌"
            help="可将完整 Webhook 复制至此，会自动提取其中的参数"
            rules={required}
            valueFormat={v => v?.replace(dingtalkPrefix, '').replace(feishuPrefix, '').replace(wxbizPrefix, '')}
          >
            <Input autocomplete="one-time-code" />
          </FormItem>

          {robotType !== MessageRobotType.WXBIZ ? (
            <FormItem
              name="secret"
              label="密钥"
              help={robotType === MessageRobotType.DINGTALK ? '重新打开机器人设置界面，复制其中的密钥' : undefined}
              rules={required}
            >
              <Input
                placeholder={robotType === MessageRobotType.DINGTALK ? 'SEC...' : undefined}
                autocomplete="one-time-code"
              />
            </FormItem>
          ) : null}

          {robotType === MessageRobotType.FEISHU ? (
            <>
              <Alert
                style={{ padding: '12px', margin: '16px 0' }}
                theme="info"
                title="关于 AppId 和 AppSecret"
                message={
                  <>
                    飞书发送图片和“@用户”需要
                    <a
                      className="mx-1 text-[var(--brand-main)]"
                      href="https://open.feishu.cn/app?lang=zh-CN"
                      target="_blank"
                    >
                      点此链接
                    </a>
                    创建平台应用，在下方填入平台应用的 AppId 和 AppSecret。
                    <br />
                    在“开发配置”→“权限管理”中给应用开通“获取与上传图片或文件资源”权限，机器人才可以发送图片；给应用开通“通过手机号或邮箱获取用户
                    ID”和“获取用户 user ID”权限，机器人才能“@用户”。
                  </>
                }
              />

              <FormItem
                name={['extraAuthentication', 'feishuUploadAppId']}
                label="飞书 AppId"
                help="用于上传图片，用不到图片功能则可不填"
              >
                <Input />
              </FormItem>

              <FormItem
                name={['extraAuthentication', 'feishuUploadAppSecret']}
                label="飞书 AppSecret"
                help="同上，如果用不到图片功能则可不填"
              >
                <Input />
              </FormItem>
            </>
          ) : null}

          <FormItem name="desc" label="备注">
            <Textarea placeholder="例如备注群组、用途等，可不填" />
          </FormItem>

          <FormItem
            name="__storageType"
            label="存储位置"
            rules={required}
            help="保存后无法更改此项；登录账号后可云端存储配置"
          >
            <Radio.Group variant="primary-filled" disabled={!isAddRobot}>
              <Radio.Button value={RobotStorageType.LOCAL}>浏览器</Radio.Button>

              {currentUser ? (
                <Radio.Button value={RobotStorageType.USER} disabled={!currentUser}>
                  我的
                </Radio.Button>
              ) : null}

              {isStaff ? (
                <Radio.Button value={RobotStorageType.COMPANY} disabled={!isStaff}>
                  公司
                </Radio.Button>
              ) : null}
            </Radio.Group>
          </FormItem>

          {robotStorageType === RobotStorageType.COMPANY ? (
            <FormItem name="__companyId" label="关联到公司" rules={required}>
              <Select placeholder="点击选择公司" options={companyOptions} disabled={!isAddRobot} />
            </FormItem>
          ) : null}
        </Form>

        <Space>
          {isAddRobot ? (
            <FormOkButton onClick={() => void robotForm.submit()} loading={loading}>
              保存机器人配置
            </FormOkButton>
          ) : lock ? (
            <>
              <FormEditButton onClick={() => void setLock(false)} loading={loading}>
                编辑
              </FormEditButton>
              <FormDeleteButton
                onConfirm={async () => {
                  if (robotStorageType === RobotStorageType.LOCAL) {
                    deleteLocalRobot(robotId!)
                  } else if (robotStorageType === RobotStorageType.COMPANY) {
                    await deleteCompanyRobotApi(companyId!, robotId!)
                    await mutate(`/message-robot/company/${companyId}/robot`)
                    robotEmitter.emit('companyRefresh', companyId!)
                  } else {
                    await deleteUserRobotApi(robotId!)
                    await mutate(`/message-robot/current`)
                  }
                  setLock(true)
                  toAddForm()
                }}
                content="确认删除此机器人配置吗？"
                loading={loading}
              >
                删除
              </FormDeleteButton>
            </>
          ) : (
            <>
              <FormOkButton onClick={() => void robotForm.submit()} loading={loading}>
                完成编辑
              </FormOkButton>
              <FormCancelButton
                onClick={() => {
                  robotForm.reset()
                  setLock(true)
                }}
                loading={loading}
              >
                放弃修改
              </FormCancelButton>
            </>
          )}
        </Space>
      </Col>

      <RobotMessage robotForm={robotForm} />
    </>
  )
}
