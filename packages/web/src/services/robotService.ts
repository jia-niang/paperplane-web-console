import { MessageRobot, Role } from '@repo/db'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { create } from 'zustand'

import { client } from '@/utils/client'
import { clientStore, SK_OA_ROBOT_LOCAL } from '@/utils/clientStore'
import { alphabetId } from '@/utils/random'

import { useAccess, useCurrentUser } from './userService'

export enum RobotStorageType {
  /** 本地 */
  LOCAL = 'local',
  /** 用户创建的（“我的”） */
  USER = 'user',
  /** 隶属于公司的（“公司的”） */
  COMPANY = 'company',
}

export const ROBOT_ADD_URL = 'new' as const

interface IRobotStore {
  localRobots: MessageRobot[]
  setLocalRobots(robots: MessageRobot[]): void
}

const useRobotStore = create<IRobotStore>()(set => ({
  localRobots: clientStore.get(SK_OA_ROBOT_LOCAL) || [],
  setLocalRobots: localRobots => {
    clientStore.set(SK_OA_ROBOT_LOCAL, localRobots)
    set({ localRobots })
  },
}))

export function useLocalRobots() {
  const { localRobots, setLocalRobots } = useRobotStore()

  function addLocalRobot(input: Partial<MessageRobot>) {
    const now = dayjs()
    const newRobot = {
      ...input,
      id: `oarobot_${now.format('YYYYMMDD')}_${alphabetId()}`,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    } as MessageRobot

    setLocalRobots([newRobot, ...localRobots!])

    return newRobot
  }

  function editLocalRobot(input: Partial<MessageRobot>) {
    const newRobot = { ...input, updatedAt: dayjs().toDate() } as MessageRobot
    const newRobots = localRobots.map(t => (t.id === input.id ? input : t)) as MessageRobot[]

    setLocalRobots(newRobots)

    return newRobot
  }

  function deleteLocalRobot(id: string) {
    setLocalRobots(localRobots?.filter(item => item.id !== id))
  }

  return { localRobots, addLocalRobot, editLocalRobot, deleteLocalRobot }
}

export function useUserRobotsSWR() {
  const currentUser = useCurrentUser()

  return useSWR<MessageRobot[]>(() => (currentUser ? `/message-robot/current` : null), client)
}

export function useCompanyRobotsSWR(companyId?: string | null) {
  const isStaff = useAccess(Role.STAFF)

  return useSWR<MessageRobot[]>(
    () => (isStaff && companyId ? `/message-robot/company/${companyId}/robot` : null),
    client
  )
}
