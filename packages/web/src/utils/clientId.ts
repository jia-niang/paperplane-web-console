import { clientStore, SK_CLIENT_ID } from './clientStore'
import { hexId } from './random'

/** 获取客户端 ID */
export function ensureClientId() {
  clientStore.transact(SK_CLIENT_ID, (id: string) => {
    return id || hexId()
  })

  return clientStore.get(SK_CLIENT_ID)
}
