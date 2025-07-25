import { MessageRobotType } from '@repo/db'

import { feishuQueryUserIdByMobiles } from './robot-api'

export function extractTitle(markdown: string): string {
  let result = markdown.length > 6 ? markdown : markdown.substring(5) + '…'

  const match = markdown.match(/^#{1,6} (\S+)/)
  if (match?.[1]) {
    result = match[1]
  }

  return result
}

export function handleFeishuMarkdown(markdown: string, config: IMarkdownMessageBody & IRobotMessageSendConfig) {
  const { type } = config

  const tagText = (t: string) => ({ tag: 'text', text: t })
  const tagA = (t: string, href: string) => ({ tag: 'a', text: t, href })
  const tagAt = (user_id: string) => ({ tag: 'at', user_id })

  // 自动提取标题的场合，此时不需要再写一遍标题，因此截去头部
  const mdTitle = markdown.match(/^#{1,6}(.+)\r?\n/)?.[1]
  if (type === MessageRobotType.FEISHU && !config.title && mdTitle) {
    markdown = markdown.replace(/^.+\r?\n/, '')
  }

  let pieces: any[] = [markdown]

  pieces = pieces.map(t => (typeof t === 'string' ? t.split(/( ?<at user_id="[a-zA-Z0-9_-]+"><\/at> ?)/) : t)).flat()
  pieces = pieces.map(t => {
    if (typeof t !== 'string') {
      return t
    }

    const atMatched = t.match(/ ?<at user_id="([a-zA-Z0-9_-]+)"><\/at>/)?.[1]

    return atMatched ? tagAt(atMatched) : t
  })

  pieces = pieces.map(t => (typeof t === 'string' ? t.split(/( ?\[[^\]]+\]\([^)]+\) ?)/) : t)).flat()
  pieces = pieces.map(t => {
    if (typeof t !== 'string') {
      return t
    }

    const aMatched = t.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (!aMatched) {
      return t
    }

    return tagA(aMatched[1], aMatched[2])
  })

  const result = [pieces.map(t => (typeof t === 'string' ? tagText(t) : t))]

  return result
}

export async function handleFeishuAt(
  input: string,
  config: IRobotMessageSendConfig & { atAll?: boolean; atList?: string[] }
) {
  const { feishuUploadAppId, feishuUploadAppSecret } = config.auth.extraAuthentication || {}
  const { atList = [], atAll = false } = config

  if (atList.length > 0 && feishuUploadAppId && feishuUploadAppSecret) {
    const queryResult = await feishuQueryUserIdByMobiles(atList, feishuUploadAppId, feishuUploadAppSecret)

    atList.forEach(mobile => {
      const userId = queryResult.moblieMap[mobile]

      if (input.includes(`@${mobile}`)) {
        input = input.replace(`@${mobile}`, `<at user_id="${userId}"></at>`)
      } else {
        input = input + ` <at user_id="${userId}"></at>`
      }
    })
  }
  if (atAll) {
    if (input.includes('@all')) {
      input = input.replace('@all', `<at user_id="all"></at>`)
    } else {
      input = input + ` <at user_id="all"></at>`
    }
  }

  return input
}
