import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SK_GPT_SETTING } from '@/utils/clientStore'

export interface IGptSetting {
  saveHistory: boolean
}

export const useGptSetting = create<IGptSetting>()(
  persist<IGptSetting>(
    () => ({
      saveHistory: true,
    }),
    { name: SK_GPT_SETTING }
  )
)
