import { MessageRobotType } from '@repo/db'

import { client } from '@/utils/client'

export async function sendRobotMessageApi(type: MessageRobotType, body: object, authBody: IMessageRobotAuth) {
  return client.post('/message-robot/custom-send', { type, body, auth: authBody })
}

export async function sendUnionRobotTextMessageApi(
  type: MessageRobotType,
  text: string,
  authBody: IMessageRobotAuth,
  atList: string[],
  atAll?: boolean
) {
  let messageBody = {}

  if (type === MessageRobotType.DINGTALK) {
    messageBody = {
      msgtype: 'text',
      text: { content: text },
      at: { atMobiles: atList, isAtAll: atAll },
    }
  } else if (type === MessageRobotType.WXBIZ) {
    messageBody = {
      msgtype: 'text',
      text: { content: text, mentioned_mobile_list: atAll ? ['@all'] : atList },
    }
  } else if (type === MessageRobotType.FEISHU) {
    messageBody = {
      msg_type: 'text',
      content: { text: atAll ? `${text} <at user_id="all">所有人</at>` : text },
    }
  } else {
    throw new Error('机器人类型错误')
  }

  return sendRobotMessageApi(type, messageBody, authBody)
}
