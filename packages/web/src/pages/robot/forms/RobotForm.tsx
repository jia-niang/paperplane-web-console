import { MessageRobotType, Role } from '@repo/db'
import { useEffect, useMemo, useState } from 'react'
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

import {
  robotEmitter,
  feishuExtraAuthenticationTips,
  MessageRobotFormData,
  required,
  robotTipsMap,
  useRobotEditForm,
} from '../common'
import RobotMessage from './RobotMessage'

const dingtalkPrefix = 'https://oapi.dingtalk.com/robot/send?access_token='
const feishuPrefix = 'https://open.feishu.cn/open-apis/bot/v2/hook/'
const wxbizPrefix = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='

const { FormItem, useForm, useWatch } = Form

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

    const { __storageType, __companyId, ...robotData } = robotForm.getFieldsValue(true) as MessageRobotFormData

    if (isAddRobot) {
      setLoading(true)
      try {
        if (__storageType === RobotStorageType.LOCAL) {
          const newRobot = addLocalRobot(robotData)
          select(RobotStorageType.LOCAL, null, newRobot.id)
        } else if (__storageType === RobotStorageType.USER) {
          const newRobot = await addUserRobotApi(robotData)
          await mutate(`/message-robot/current`)
          select(RobotStorageType.USER, null, newRobot.id)
        } else if (__storageType === RobotStorageType.COMPANY) {
          const newRobot = await addCompanyRobotApi(__companyId!, robotData)
          await mutate(`/message-robot/company/${__companyId}/robot`)
          robotEmitter.emit('companyRefresh', __companyId!)
          select(RobotStorageType.COMPANY, __companyId!, newRobot.id)
        }
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(true)
      try {
        if (__storageType === RobotStorageType.LOCAL) {
          const newRobot = editLocalRobot(robotData)
          setRobot({ ...newRobot, __storageType })
        } else if (__storageType === RobotStorageType.USER) {
          const newRobot = await editUserRobotApi(robotData)
          await mutate(`/message-robot/current`)
          setRobot({ ...newRobot, __storageType })
        } else if (__storageType === RobotStorageType.COMPANY) {
          const newRobot = await editCompanyRobotApi(__companyId!, robotData)
          await mutate(`/message-robot/company/${__companyId}/robot`)
          robotEmitter.emit('companyRefresh', __companyId!)
          setRobot({ ...newRobot, __storageType, __companyId })
        }
      } finally {
        setLock(true)
        setLoading(false)
      }
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
              className="mb-4"
              style={{ padding: '12px' }}
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
              <FormItem
                name={['extraAuthentication', 'feishuUploadAppId']}
                label="飞书 AppId"
                help={feishuExtraAuthenticationTips}
              >
                <Input />
              </FormItem>

              <FormItem
                name={['extraAuthentication', 'feishuUploadAppSecret']}
                label="飞书 AppSecret"
                help={feishuExtraAuthenticationTips}
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
