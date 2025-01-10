import type { useNavigate } from 'react-router'
import { create } from 'zustand'

export interface IRouterStore {
  navigate: ReturnType<typeof useNavigate>
  setNavigate(navigate: ReturnType<typeof useNavigate>): void
}

export const useRouterStore = create<IRouterStore>()(set => ({
  navigate: (() => {}) as ReturnType<typeof useNavigate>,
  setNavigate: navigate => void set({ navigate }),
}))

/** 在任意位置导航 */
export const navigate: ReturnType<typeof useNavigate> = (...restProps) =>
  // @ts-expect-error 无法通过 any 类型处理
  useRouterStore.getState().navigate(...restProps)
