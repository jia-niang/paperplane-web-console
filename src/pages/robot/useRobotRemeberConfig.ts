import { useLocalStorageState } from 'ahooks'

import { SK_ROBOT_CONFIG } from '@/utils/clientStore'

export interface IRemeberConfig {
  isRemeber: boolean
  tabType: RobotType
  accessToken?: string
  secret?: string
}

export const defaultRemeberConfig: IRemeberConfig = {
  isRemeber: false,
  tabType: 'wxbiz',
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
