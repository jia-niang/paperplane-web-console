import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { SK_SETTING } from '@/utils/clientStore'

export interface IGloalSetting {
  gptSetting: {
    saveHisotry: boolean
  }
}

export const useGloalSetting = create(
  persist(
    () => ({
      gptSetting: {
        saveHisotry: true,
      },
    }),
    { name: SK_SETTING }
  )
)
