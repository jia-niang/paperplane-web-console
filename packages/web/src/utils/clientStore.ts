import { createInstance } from 'localforage'

const LOCAL_FORAGE_DB_NAME = 'paperplane-web-console' as const

/** localforage 实例，管理客户端本地存储 */
export const clientStore = createInstance({ name: LOCAL_FORAGE_DB_NAME, version: 1 })

/** 客户端 ID */
export const LF_CLIENT_ID = `cid`
