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

export async function sendRobotMessageApi(type: MessageRobotType, auth: IMessageRobotAuth, json: object) {
  return client.post('/message-robot/custom/send', { type, auth, json })
}

export async function sendRobotMessageTextApi(type: MessageRobotType, auth: IMessageRobotAuth, body: ITextMessageBody) {
  return client.post('/message-robot/custom/send/text', { ...body, type, auth })
}

export async function sendRobotMessageMarkdownApi(
  type: MessageRobotType,
  auth: IMessageRobotAuth,
  body: IMarkdownMessageBody
) {
  return client.post('/message-robot/custom/send/markdown', { ...body, type, auth })
}

export async function sendRobotImageApi(type: MessageRobotType, auth: IMessageRobotAuth, body: IImageMessageBody) {
  return client.post('/message-robot/custom/send/image', { ...body, type, auth })
}

export async function robotUploadPresignImageApi(ext: string): Promise<{ preSignUrl: string; publicUrl: string }> {
  return client.post('/message-robot/custom/upload-presign/image', { ext })
}
