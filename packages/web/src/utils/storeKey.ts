const STORAGE_KEY_PREFIX = 'cc.paperplane.console.' as const

function prefix(arg1: string | TemplateStringsArray, ...restArgs: string[]) {
  if (typeof arg1 === 'string') {
    return STORAGE_KEY_PREFIX + arg1
  }
  const result = arg1.reduce((result, frag, index) => result.concat(frag).concat(restArgs[index] || ''), '')

  return STORAGE_KEY_PREFIX + result
}

/** GPT 设置 */
export const SK_GPT_SETTING = prefix`gpt-setting`

/** GPT 提问记录 */
export const SK_GPT_RECORDS = prefix`gpt-record`

/** 机器人配置 */
export const SK_ROBOT_CONFIG = prefix`robot-config`
