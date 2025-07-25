import { Injectable } from '@nestjs/common'
import { MessageRobotType, Prisma } from '@repo/db'
import axios from 'axios'
import { PrismaService } from 'nestjs-prisma'

import { hexId } from '@/utils/random'

import { S3Service } from '../s3/s3.service'
import { UserService } from '../user/user.service'
import { MessageRobotGeneratorService } from './message-robot-generator.service'
import { feishuRobotSign, dingtalkRobotSign } from './robot-sign'

const wxbizRobotUrl = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=`
const dintalkRobotUrl = `https://oapi.dingtalk.com/robot/send?access_token=`
const feishuRobotUrl = `https://open.feishu.cn/open-apis/bot/v2/hook/`

@Injectable()
export class MessageRobotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly gen: MessageRobotGeneratorService,
    private readonly s3: S3Service
  ) {}

  // 用户机器人

  async addUserRobot(userId: string, robot: Prisma.MessageRobotUncheckedCreateInput) {
    robot.userId = userId
    robot.companyId = null

    return this.prisma.messageRobot.create({ data: robot })
  }

  async listUserRobots(userId: string) {
    return this.prisma.messageRobot.findMany({ where: { userId } })
  }

  async getUserRobotById(userId: string, id: string) {
    return this.prisma.messageRobot.findFirstOrThrow({ where: { id, userId } })
  }

  async updateUserRobot(userId: string, id: string, robot: Prisma.MessageRobotUncheckedUpdateInput) {
    await this.prisma.messageRobot.findFirstOrThrow({ where: { id, userId } })

    return this.prisma.messageRobot.update({ where: { id, userId }, data: robot })
  }

  async deleteUserRobot(userId: string, id: string) {
    await this.prisma.messageRobot.findFirstOrThrow({ where: { id, userId } })

    return this.prisma.messageRobot.delete({ where: { id, userId } })
  }

  async ensureUserAndMessageRobot(userId: string, robotId: string, throwError?: string | Error) {
    if (await this.userService.ensureAdminRole(userId)) {
      return true
    }

    const relation = await this.prisma.messageRobot.findFirst({
      where: { id: robotId, userId },
      include: { belongToUser: true },
    })

    if (relation) {
      return true
    } else if (throwError) {
      throw typeof throwError === 'string' ? new Error(throwError) : throwError
    }

    return false
  }

  // 用户机器人 发送消息

  async sendJSONByUserRobotId(userId: string, id: string, json: object) {
    const robotConfig = await this.prisma.messageRobot.findFirstOrThrow({ where: { id, userId } })

    return this.sendBase({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, json })
  }

  async sendTextByUserRobotId(userId: string, id: string, body: ITextMessageBody) {
    const robotConfig = await this.prisma.messageRobot.findFirstOrThrow({ where: { id, userId } })
    const json = await this.gen.text({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, ...body })

    return this.sendBase({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, json })
  }

  // 公司机器人

  async addCompanyRobot(companyId: string, robot: Prisma.MessageRobotUncheckedCreateInput) {
    robot.userId = null
    robot.companyId = companyId

    return this.prisma.messageRobot.create({ data: robot })
  }

  async listCompanyRobots(companyId: string) {
    return this.prisma.messageRobot.findMany({ where: { companyId } })
  }

  async getCompanyRobotById(companyId: string, id: string) {
    return this.prisma.messageRobot.findFirstOrThrow({ where: { id, companyId } })
  }

  async updateCompanyRobot(companyId: string, id: string, robot: Prisma.MessageRobotUncheckedUpdateInput) {
    await this.prisma.messageRobot.findFirstOrThrow({ where: { id, companyId } })

    return this.prisma.messageRobot.update({ where: { id, companyId }, data: robot })
  }

  async deleteCompanyRobot(companyId: string, id: string) {
    await this.prisma.messageRobot.findFirstOrThrow({ where: { id, companyId } })

    return this.prisma.messageRobot.delete({ where: { id, companyId } })
  }

  async ensureCompanyAndMessageRobot(companyId: string, robotId: string, throwError?: string | Error) {
    const relation = await this.prisma.messageRobot.findFirst({
      where: { id: robotId, companyId },
    })

    if (relation) {
      return true
    } else if (throwError) {
      throw typeof throwError === 'string' ? new Error(throwError) : throwError
    }

    return false
  }

  // 公司机器人 发送消息

  async sendJSONByCompanyRobotId(companyId: string, id: string, json: object) {
    const robotConfig = await this.prisma.messageRobot.findFirstOrThrow({ where: { id, companyId } })

    return this.sendBase({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, json })
  }

  async sendTextByCompanyRobotId(companyId: string, id: string, body: ITextMessageBody) {
    const robotConfig = await this.prisma.messageRobot.findFirstOrThrow({ where: { id, companyId } })
    const json = await this.gen.text({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, ...body })

    return this.sendBase({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, json })
  }

  // 本地机器人

  /** 内部使用，提供机器人 ID，发送纯文本 */
  async sendTextByRobotId(id: string, body: ITextMessageBody) {
    const robotConfig = await this.prisma.messageRobot.findFirstOrThrow({ where: { id } })
    const json = await this.gen.text({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, ...body })

    return this.sendBase({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, json })
  }

  /** 内部使用，提供机器人 ID，发送一张图片 */
  async sendImageByRobotId(id: string, body: IImageMessageBody) {
    const robotConfig = await this.prisma.messageRobot.findFirstOrThrow({ where: { id } })
    const json = await this.gen.image({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, ...body })

    return this.sendBase({ type: robotConfig.type, auth: robotConfig as IMessageRobotAuth, json })
  }

  // 即配即用机器人

  /** 发送纯文本 */
  async sendBaseText(config: ITextMessageBody & IRobotMessageSendConfig) {
    const json = await this.gen.text(config)

    return this.sendBase({ type: config.type, auth: config.auth, json })
  }

  /** 发送 Markdown */
  async sendBaseMarkdown(config: IMarkdownMessageBody & IRobotMessageSendConfig) {
    const { type, auth } = config
    const json = await this.gen.markdown(config)

    return this.sendBase({ type, auth, json })
  }

  /** 发送图片 */
  async sendBaseImage(config: IImageMessageBody & IRobotMessageSendConfig) {
    const { type, auth } = config
    const json = await this.gen.image(config)

    return this.sendBase({ type, auth, json })
  }

  /** 上传图片预签名 */
  async basePresignImage(body: { ext: string }) {
    const random = hexId(12)
    const path = `/usercontent/message-robot/${random}.${body.ext}`

    return await this.s3.uploadSign(path)
  }

  /** 提供机器人完整配置（类型、令牌、密钥）来发送原始 JSON 消息 */
  async sendBase(config: IJsonMessageBody & IRobotMessageSendConfig) {
    const { type, json } = config
    const { accessToken, secret } = config.auth

    if (type === MessageRobotType.DINGTALK) {
      const { sign, timestamp } = dingtalkRobotSign(secret!)

      return axios
        .post(dintalkRobotUrl + accessToken + `&timestamp=${timestamp}&sign=${sign}`, json)
        .then(res => res.data)
        .then(res => {
          if (res.errcode !== 0) {
            throw new Error(`钉钉机器人调用出错 [${res.errmsg}]`)
          }

          return res
        })
    } else if (type === MessageRobotType.FEISHU) {
      const { sign, timestamp } = feishuRobotSign(secret!)

      return axios
        .post(feishuRobotUrl + accessToken, { timestamp: String(timestamp), sign, ...json })
        .then(res => res.data)
        .then(res => {
          if (res.code !== 0) {
            throw new Error(`飞书机器人调用出错 [${res.msg}]`)
          }

          return res
        })
    } else if (type === MessageRobotType.WXBIZ) {
      return axios
        .post(wxbizRobotUrl + accessToken, json)
        .then(res => res.data)
        .then(res => {
          if (res.errcode !== 0) {
            throw new Error(`企微机器人调用出错 [${res.errmsg}]`)
          }

          return res
        })
    } else {
      throw new Error('未知的机器人类型')
    }
  }
}
