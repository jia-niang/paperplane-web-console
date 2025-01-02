import { createInstance } from 'localforage'

/** localforage 实例，管理客户端本地存储 */
export const clientStore = createInstance({ name: 'paperplane-web-console', version: 1 })

/** 客户端 ID */
export const SK_CLIENT_ID = `cid`

/** 网站设置 */
export const SK_SETTING = `setting`

/** GPT 提问记录 */
export const SK_GPT_RECORDS = `gpt-record`

/** 机器人配置 */
export const SK_ROBOT_CONFIG = `robot-config`
