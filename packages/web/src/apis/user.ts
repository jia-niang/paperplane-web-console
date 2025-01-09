import { User } from '@repo/db'
import { tap } from 'lodash-es'
import { mutate } from 'swr'

import { browserRouter } from '@/router'
import { useUserStore } from '@/services/userService'
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
  return client.get<User>(`/user/current`, { quiet: true }).then(user => tap(user, useUserStore.getState().login))
}

export async function logoutApi() {
  return client.post<void>(`/user/logout`).then(() => {
    browserRouter.navigate(`/`)
    useUserStore.getState().logout()
    mutate(`/user/current`, null)
  })
}
