import { MessageRobotType } from '@repo/db'
import { useLocalStorageState } from 'ahooks'

import { SK_ROBOT_CONFIG } from '@/utils/clientStore'

export interface IRemeberConfig {
  isRemeber: boolean
  tabType: MessageRobotType
  accessToken?: string
  secret?: string
}

export const defaultRemeberConfig: IRemeberConfig = {
  isRemeber: false,
  tabType: MessageRobotType.WXBIZ,
}

export default function useRobotRemeberConfig() {
  const [remeberConfig, setRemeberConfig] = useLocalStorageState<IRemeberConfig>(SK_ROBOT_CONFIG, {
    defaultValue: defaultRemeberConfig,
  })

  function resetRemeberConfig() {
    setRemeberConfig(defaultRemeberConfig)
  }

  return [remeberConfig!, setRemeberConfig, resetRemeberConfig] as const
}
