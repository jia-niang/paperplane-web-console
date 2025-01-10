import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SK_GPT_SETTING } from '@/utils/storeKey'

export interface IGptSetting {
  saveHisotry: boolean
}

export const useGptSetting = create<IGptSetting>()(
  persist<IGptSetting>(
    () => ({
      saveHisotry: true,
    }),
    { name: SK_GPT_SETTING }
  )
)
