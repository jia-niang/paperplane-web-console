import { Injectable } from '@nestjs/common'
import { OffworkNoticeSetting } from '@repo/db'
import dayjs from 'dayjs'
import { PrismaService } from 'nestjs-prisma'

import { MessageRobotService } from '../message-robot/message-robot.service'
import { WxBizService } from '../wxbiz/wxbiz.service'

@Injectable()
export class DailyOffworkSenderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly robot: MessageRobotService,
    private readonly wxbiz: WxBizService
  ) {}

  /** 发送所有消息 */
  async offworkSend(robotSetting: OffworkNoticeSetting, imageUrl: string) {
    const mailSubscriptions = await this.prisma.offworkNoticeMailSubscription.findMany({
      where: { offworkNoticeSettingId: robotSetting.id, disabled: false },
    })

    if (mailSubscriptions.length > 0) {
      const emails = mailSubscriptions.map(item => item.mail)
      const date = dayjs().format('YYYY-MM-DD')
      await this.wxbiz.sendMail({
        to: { emails },
        subject: `Offwork Notice: ${date}`,
        content: `<img src="${imageUrl}" />`,
      })
    }

    await this.robot.sendTextByRobotId(robotSetting.messageRobotId, { text: `下班了`, atAll: true })
    await this.robot.sendImageByRobotId(robotSetting.messageRobotId, { imageUrl })
  }
}
