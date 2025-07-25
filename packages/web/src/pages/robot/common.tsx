import { MessageRobot, MessageRobotType } from '@repo/db'
import mitt from 'mitt'
import { useEffect } from 'react'
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
