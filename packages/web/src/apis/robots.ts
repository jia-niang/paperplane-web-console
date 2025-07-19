import { MessageRobot, MessageRobotType } from '@repo/db'

import { client } from '@/utils/client'

export async function listUserRobotsApi() {
  return client.get<MessageRobot[]>(`/message-robot/current`)
}

export async function fetchUserRobotByIdApi(id: string) {
  return client.get<MessageRobot>(`/message-robot/current/${id}`)
}

export async function addUserRobotApi(robot: Partial<MessageRobot>) {
  return client.post<MessageRobot>(`/message-robot/current`, robot)
}

export async function editUserRobotApi(robot: Partial<MessageRobot>) {
  return client.put<MessageRobot>(`/message-robot/current/${robot.id}`, robot)
}

export async function deleteUserRobotApi(id: string) {
  return client.delete(`/message-robot/current/${id}`)
}

export async function listCompanyRobotsByCompanyIdApi(companyId: string) {
  return client.get<MessageRobot[]>(`/message-robot/company/${companyId}/robot`)
}

export async function fetchCompanyRobotByIdsApi(companyId: string, id: string) {
  return client.get<MessageRobot>(`/message-robot/company/${companyId}/robot/${id}`)
}

export async function addCompanyRobotApi(companyId: string, robot: Partial<MessageRobot>) {
  return client.post<MessageRobot>(`/message-robot/company/${companyId}/robot`, robot)
}

export async function editCompanyRobotApi(companyId: string, robot: Partial<MessageRobot>) {
  return client.put<MessageRobot>(`/message-robot/company/${companyId}/robot/${robot.id}`, robot)
}

export async function deleteCompanyRobotApi(companyId: string, robotId: string) {
  return client.delete(`/message-robot/company/${companyId}/robot/${robotId}`)
}

export async function sendRobotMessageApi(type: MessageRobotType, body: object, authBody: IMessageRobotAuth) {
  return client.post('/message-robot/custom-send', { type, body, auth: authBody })
}

export async function universalSendRobotTextMessageApi(
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
