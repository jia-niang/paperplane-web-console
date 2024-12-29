type RobotType = 'wxbiz' | 'dingtalk' | 'feishu'

interface IRobotAuth {
  accessToken: string
  secret?: string
}

interface ICustomRobotMessage {
  type: string
  body: object
  auth: IRobotAuth
}
