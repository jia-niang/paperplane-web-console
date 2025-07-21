import { MessageRobot, MessageRobotType } from '@repo/db'
import mitt from 'mitt'
import { ReactNode, useEffect } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router'
import { create } from 'zustand'

import { RobotStorageType } from '@/services/robotService'

export interface MessageRobotFormData extends Partial<MessageRobot> {
  __storageType?: RobotStorageType
  __companyId?: string
}

export const defaultRobot: MessageRobotFormData = {
  desc: '',
  type: MessageRobotType.WXBIZ,
  __storageType: RobotStorageType.LOCAL,
}

export const ROBOT_ADD_URL = 'new' as const

export const required = [{ required: true }]

export function robotUrlId(id?: string) {
  return id !== ROBOT_ADD_URL ? id : undefined
}

export const robotEmitter = mitt<{
  companyRefresh: string
  select: { type: RobotStorageType; companyId: string | null; robotId: string | null }
}>()

interface IRobotLock {
  lock: boolean
  setLock(lock: boolean): void

  robot: MessageRobotFormData
  setRobot(robot: MessageRobotFormData): void
}

const useRobotStore = create<IRobotLock>()(set => ({
  lock: true,
  setLock: lock => void set({ lock }),

  robot: defaultRobot,
  setRobot: robot => void set({ robot }),
}))

export function useRobotEditForm() {
  const { storageType, companyId, robotId } = useParams<{
    storageType?: RobotStorageType
    companyId?: string
    robotId?: string
  }>()
  const navigate = useNavigate()
  const isAddRobot = useMatch(`/robot/${ROBOT_ADD_URL}`)

  const { lock, setLock } = useRobotStore()
  const { robot, setRobot } = useRobotStore()

  useEffect(() => void setLock(!isAddRobot), [isAddRobot, storageType, companyId, robotId, setLock])

  function select(storageType: RobotStorageType, companyId: string | null, robotId: string | null) {
    const urlRobotId = robotId ? robotId : ROBOT_ADD_URL
    robotEmitter.emit('select', { type: storageType, companyId, robotId })

    if (storageType === RobotStorageType.COMPANY) {
      navigate(`/robot/${storageType}/${companyId!}/robots/${urlRobotId}`)
    } else {
      navigate(`/robot/${storageType}/${urlRobotId}`)
    }
  }

  function toAddForm() {
    navigate(`/robot/${ROBOT_ADD_URL}`)
  }

  return { lock, setLock, robot, setRobot, storageType, companyId, robotId, isAddRobot, select, toAddForm }
}

export const feishuExtraAuthenticationTips = (
  <>
    用于上传图片，如果用不到图片功能则可不填，
    <a
      className="text-[var(--brand-main)]"
      href="https://open.feishu.cn/document/server-docs/im-v1/image/create"
      target="_blank"
    >
      参考文档
    </a>
  </>
)

export const robotTipsMap: Record<MessageRobotType, ReactNode> = {
  [MessageRobotType.DINGTALK]: <>群管理 → 添加机器人 → 自定义；安全设置仅支持“加签”。</>,
  [MessageRobotType.FEISHU]: <>群机器人 → 添加 → 自定义机器人；安全设置仅支持“签名校验”。</>,
  [MessageRobotType.WXBIZ]: <>群设置 → 添加群机器人 → 新创建。</>,
}
