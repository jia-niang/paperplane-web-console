import { Injectable } from '@nestjs/common'
import { MessageRobotType } from '@repo/db'

import { feishuUpload, handleWxBizImage } from '@/services/message-robot/robot-api'

import { extractTitle, handleFeishuAt, handleFeishuMarkdown } from './robot-format'

@Injectable()
export class MessageRobotGeneratorService {
  constructor() {}

  /** 文本消息 */
  async text(config: IRobotMessageSendConfig & ITextMessageBody) {
    const { type, atAll = false, atList = [] } = config
    let { text } = config

    if (type === MessageRobotType.DINGTALK) {
      return { msgtype: 'text', text: { content: text }, at: { atMobiles: atList, isAtAll: atAll } }
    } else if (type === MessageRobotType.FEISHU) {
      text = await handleFeishuAt(text, config)

      return { msg_type: 'text', content: { text } }
    } else if (type === MessageRobotType.WXBIZ) {
      return { msgtype: 'text', text: { content: text, mentioned_mobile_list: atAll ? [...atList, '@all'] : atList } }
    } else {
      throw new Error('未知的机器人类型')
    }
  }

  async markdown(config: IMarkdownMessageBody & IRobotMessageSendConfig) {
    const { type, atAll = false, atList = [] } = config
    let { markdown, title } = config

    title = title || extractTitle(markdown)

    if (type === MessageRobotType.DINGTALK) {
      if (atAll && !markdown.includes('@all')) {
        markdown = markdown + ' @all'
      } else if (atList.length > 0) {
        atList.forEach(mobile => {
          if (!markdown.includes(`@${mobile}`)) {
            markdown = markdown + ` @${mobile} `
          }
        })
      }

      return {
        msgtype: 'markdown',
        markdown: { text: markdown, title },
        at: { atMobiles: atList, isAtAll: atAll },
      }
    } else if (type === MessageRobotType.FEISHU) {
      markdown = await handleFeishuAt(markdown, config)
      const content = handleFeishuMarkdown(markdown, config)

      return { msg_type: 'post', content: { post: { zh_cn: { title, content } } } }
    } else if (type === MessageRobotType.WXBIZ) {
      return { msgtype: 'markdown', markdown: { content: markdown } }
    } else {
      throw new Error('未知的机器人类型')
    }
  }

  /** 单张图片 */
  async image(config: IRobotMessageSendConfig & IImageMessageBody) {
    const { type, auth, imageUrl, title } = config
    const { feishuUploadAppId, feishuUploadAppSecret } = auth.extraAuthentication || {}

    if (type === MessageRobotType.FEISHU && (!feishuUploadAppId || !feishuUploadAppSecret)) {
      throw new Error('飞书机器人发送图片消息，需提供 AppId 与 AppSecret')
    }

    if (type === MessageRobotType.DINGTALK) {
      return { msgtype: 'markdown', markdown: { title: title || '[图片]', text: `![](${imageUrl})` } }
    } else if (type === MessageRobotType.FEISHU) {
      const feishuImageKey = await feishuUpload(imageUrl, feishuUploadAppId!, feishuUploadAppSecret!)
      return { msg_type: 'image', content: { image_key: feishuImageKey } }
    } else if (type === MessageRobotType.WXBIZ) {
      return { msgtype: 'image', image: await handleWxBizImage(imageUrl) }
    } else {
      throw new Error('未知的机器人类型')
    }
  }
}
