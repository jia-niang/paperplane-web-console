import { client } from '@/utils/client'

export async function sendRobotMessageApi(type: RobotType, body: object, authBody: IRobotAuth) {
  return client.post('/message-robot/custom-send', { type, body, auth: authBody })
}

export async function sendUnionRobotTextMessageApi(
  type: RobotType,
  text: string,
  authBody: IRobotAuth,
  atList: string[],
  atAll?: boolean
) {
  let messageBody = {}

  if (type === 'dingtalk') {
    messageBody = {
      msgtype: 'text',
      text: { content: text },
      at: { atMobiles: atList, isAtAll: atAll },
    }
  } else if (type === 'wxbiz') {
    messageBody = {
      msgtype: 'text',
      text: { content: text, mentioned_mobile_list: atAll ? ['@all'] : atList },
    }
  } else if (type === 'feishu') {
    messageBody = {
      msg_type: 'text',
      content: { text: atAll ? `${text} <at user_id="all">所有人</at>` : text },
    }
  } else {
    throw new Error('机器人类型错误')
  }

  return sendRobotMessageApi(type, messageBody, authBody)
}
