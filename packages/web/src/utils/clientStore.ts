import store2 from 'store2'

const STORAGE_KEY_NAMESPACE = 'cc.paperplane.console' as const

export const clientStore = store2.namespace(STORAGE_KEY_NAMESPACE)

/** 客户端 ID */
export const SK_CLIENT_ID = `cid`

/** GPT 设置 */
export const SK_GPT_SETTING = `gpt.setting`

/** GPT 提问记录 */
export const SK_GPT_RECORDS = `gpt.history`

/** 浏览器储存的 OA 机器人配置 */
export const SK_OA_ROBOT_LOCAL = `robot.local`
