import { Role, User } from '@repo/db'
import useSWR, { mutate } from 'swr'
import { create } from 'zustand'

import { currentUserApi } from '@/apis/user'

import { navigate } from './routerService'

interface ILoginInfoState {
  user: User | null
}

const initState: ILoginInfoState = {
  user: null,
}

export interface ILoginInfo extends ILoginInfoState {
  login(user: User): void
  refresh(user: User): void
  logout(): void
}

export const useUserStore = create<ILoginInfo>()(set => ({
  ...initState,
  login: (user: User) => {
    set({ user })
    mutate(`/user/current`, user)
  },
  refresh: (user: User) => {
    set({ user })
  },
  logout: () => {
    navigate(`/`)
    set(initState)
    mutate(`/user/current`, null)
  },
}))

export function useCurrentUser() {
  return useUserStore(t => t.user)
}

export function useCurrentUserSWR() {
  return useSWR<User | null>(`/user/current`, currentUserApi)
}

export function useAccess(target?: Role) {
  const currentUser = useCurrentUser()
  const accessPriorit = [Role.USER, Role.STAFF, Role.ADMIN]

  if (!target) {
    return true
  } else if (!currentUser) {
    return false
  } else {
    return accessPriorit.indexOf(currentUser.role) >= accessPriorit.indexOf(target)
  }
}
