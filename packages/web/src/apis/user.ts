import { User } from '@repo/db'
import { mutate } from 'swr'

import { useUserStore } from '@/services/currentUser'
import { client } from '@/utils/client'

export async function signUpApi(user: User) {
  return client.post<User>(`/user/signup`, user)
}

export async function loginApi(name: string, password: string) {
  return client.post<User>(`/user/login`, { name, password }, { quiet: true }).then(user => {
    useUserStore.getState().login(user)
    mutate(`/user/current`, user)

    return user
  })
}

export async function currentUserApi() {
  return client
    .get<User>(`/user/current`, { quiet: true })
    .then(user => {
      useUserStore.getState().login(user)

      return user
    })
    .catch(() => null)
}

export async function logoutApi() {
  return client.post<void>(`/user/logout`).then(() => {
    useUserStore.getState().logout()
    mutate(`/user/current`, null)
  })
}
