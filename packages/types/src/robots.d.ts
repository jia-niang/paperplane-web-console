interface IMessageRobotAuth {
  accessToken?: string
  secret?: string
  extraAuthentication?: IMessageExtraAuthentication
}

interface IMessageExtraAuthentication {
  feishuUploadAppId?: string
  feishuUploadAppSecret?: string
}

interface IRobotMessageSendConfig {
  type: string
  auth: IMessageRobotAuth
}

interface IJsonMessageBody {
  json: object
}

interface ITextMessageBody {
  text: string
  atAll?: boolean
  atList?: string[]
}

interface IMarkdownMessageBody {
  markdown: string
  /** 标题，钉钉用于通知显示，飞书用于首行，企业微信不可用 */
  title?: string
  /** 是否 “@全体”，仅钉钉和飞书 */
  atAll?: boolean
  /** 提及用户，仅钉钉和飞书 */
  atList?: string[]
}

interface IImageMessageBody {
  imageUrl: string
  /** 标题，钉钉用于通知显示 */
  title?: string
}
