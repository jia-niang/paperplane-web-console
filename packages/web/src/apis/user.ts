import { User } from '@repo/db'

import { useUserStore } from '@/services/userService'
import { client } from '@/utils/client'

export async function signUpApi(user: Partial<User>) {
  return client.post<User>(`/user/signup`, user)
}

export async function loginApi(name: string, password: string) {
  return client.post<User>(`/user/login`, { name, password }, { quiet: true }).then(user => {
    useUserStore.getState().login(user)
    return user
  })
}

export async function currentUserApi() {
  return client.get<User>(`/user/current`, { quiet: true }).then(user => {
    useUserStore.getState().refresh(user)
    return user
  })
}

export async function logoutApi() {
  return client.post<void>(`/user/logout`).then(() => {
    useUserStore.getState().logout()
  })
}
