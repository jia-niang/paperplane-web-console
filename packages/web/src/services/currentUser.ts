import { User } from '@repo/db'
import useSWR from 'swr'
import { create } from 'zustand'

import { currentUserApi } from '@/apis/user'

interface ILoginInfoState {
  user: User | null
}

const initState: ILoginInfoState = {
  user: null,
}

export interface ILoginInfo extends ILoginInfoState {
  login(user: User): void
  logout(): void
}

export const useUserStore = create<ILoginInfo>()(set => ({
  ...initState,
  login: (user: User) => void set({ user }),
  logout: () => void set(initState),
}))

export function useCurrentUser() {
  return useUserStore(t => t.user)
}

export function useCurrentUserSWR() {
  return useSWR<User | null>(`/user/current`, currentUserApi)
}
