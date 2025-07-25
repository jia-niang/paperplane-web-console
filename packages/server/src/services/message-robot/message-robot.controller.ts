import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { Prisma } from '@repo/db'

import { Public, UserId } from '@/app/auth.decorator'
import { StaffRole } from '@/app/role.decorator'

import { MessageRobotService } from './message-robot.service'

@Controller('/message-robot')
export class MessageRobotController {
  constructor(private readonly messageRobotService: MessageRobotService) {}

  // 用户机器人

  @Post('/current')
  async addUserRobot(@UserId() userId: string, @Body() robot: Prisma.MessageRobotCreateInput) {
    return this.messageRobotService.addUserRobot(userId, robot)
  }

  @Get('/current')
  async listUserRobots(@UserId() userId: string) {
    return this.messageRobotService.listUserRobots(userId)
  }

  @Get('/current/:id')
  async getUserRobotById(@UserId() userId: string, @Param('id') id: string) {
    return this.messageRobotService.getUserRobotById(userId, id)
  }

  @Put('/current/:id')
  async updateUserRobot(
    @Param('id') id: string,
    @Body() robot: Prisma.MessageRobotUncheckedUpdateInput,
    @UserId() userId: string
  ) {
    return this.messageRobotService.updateUserRobot(userId, id, robot)
  }

  @Delete('/current/:id')
  async deleteUserRobot(@UserId() userId: string, @Param('id') id: string) {
    return this.messageRobotService.deleteUserRobot(userId, id)
  }

  // 用户机器人 发送相关

  @Post('/current/:id/send')
  async sendMessageByUserRobotId(@UserId() userId: string, @Param('id') id: string, @Body() body: object) {
    return this.messageRobotService.sendJSONByUserRobotId(userId, id, body)
  }

  @Post('/current/:id/send/text')
  async sendTextByUserRobotId(@UserId() userId: string, @Param('id') id: string, @Body() body: ITextMessageBody) {
    return this.messageRobotService.sendTextByUserRobotId(userId, id, body)
  }

  // 公司机器人

  @StaffRole()
  @Post('/company/:companyId/robot')
  async addCompanyRobot(@Param('companyId') companyId: string, @Body() robot: Prisma.MessageRobotCreateInput) {
    return this.messageRobotService.addCompanyRobot(companyId, robot)
  }

  @StaffRole()
  @Get('/company/:companyId/robot')
  async listCompanyRobots(@Param('companyId') companyId: string) {
    return this.messageRobotService.listCompanyRobots(companyId)
  }

  @StaffRole()
  @Get('/company/:companyId/robot/:id')
  async getCompanyRobotById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.messageRobotService.getCompanyRobotById(companyId, id)
  }

  @StaffRole()
  @Put('/company/:companyId/robot/:id')
  async updateCompanyRobot(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() robot: Prisma.MessageRobotUncheckedUpdateInput
  ) {
    return this.messageRobotService.updateCompanyRobot(companyId, id, robot)
  }

  @StaffRole()
  @Delete('/company/:companyId/robot/:id')
  async deleteCompanyRobot(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.messageRobotService.deleteCompanyRobot(companyId, id)
  }

  // 公司机器人 发送相关

  @StaffRole()
  @Post('/company/:companyId/robot/:id/send')
  async sendMessageByCompanyRobotId(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: object
  ) {
    return this.messageRobotService.sendJSONByCompanyRobotId(companyId, id, body)
  }

  @StaffRole()
  @Post('/company/:companyId/robot/:id/send/text')
  async sendTextByCompanyRobotId(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: ITextMessageBody
  ) {
    return this.messageRobotService.sendTextByCompanyRobotId(companyId, id, body)
  }

  // 即配即用机器人

  @Public()
  @Post('/custom/send')
  async customSend(@Body() body: IJsonMessageBody & IRobotMessageSendConfig) {
    const result = await this.messageRobotService.sendBase(body)

    return result
  }

  @Public()
  @Post('/custom/send/text')
  async customSendText(@Body() body: ITextMessageBody & IRobotMessageSendConfig) {
    return this.messageRobotService.sendBaseText(body)
  }

  @Public()
  @Post('/custom/send/markdown')
  async customSendMarkdown(@Body() body: IMarkdownMessageBody & IRobotMessageSendConfig) {
    return this.messageRobotService.sendBaseMarkdown(body)
  }

  @Public()
  @Post('/custom/send/image')
  async customSendImage(@Body() body: IImageMessageBody & IRobotMessageSendConfig) {
    return this.messageRobotService.sendBaseImage(body)
  }

  @Public()
  @Post('/custom/upload-presign/image')
  async customUploadPresignImage(@Body() body: { ext: string }) {
    return this.messageRobotService.basePresignImage(body)
  }
}
