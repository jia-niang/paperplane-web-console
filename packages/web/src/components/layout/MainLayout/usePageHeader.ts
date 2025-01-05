import { ReactNode } from 'react'
import { create } from 'zustand'

interface IPageHeaderState {
  toolbar: ReactNode
}

const initState: IPageHeaderState = {
  toolbar: null,
}

export interface IPageHeader extends IPageHeaderState {
  setToolbar(toolbar: ReactNode): void
}

export const usePageHeader = create<IPageHeader>()(set => ({
  ...initState,

  setToolbar: (toolbar: boolean) => void set({ toolbar }),
}))
