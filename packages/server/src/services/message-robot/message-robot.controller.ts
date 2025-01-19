import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { MessageRobot, MessageRobotType, Prisma } from '@repo/db'

import { Public, UserId } from '@/app/auth.decorator'

import { MessageRobotService } from './message-robot.service'

export interface ICustomSendBody {
  type: MessageRobotType
  auth: IMessageRobotAuth
  body: object
}

@Controller('/message-robot')
export class MessageRobotController {
  constructor(private readonly messageRobotService: MessageRobotService) {}

  @Post('/current')
  async addUserRobot(@UserId() userId: string, @Body() robot: Prisma.MessageRobotUncheckedCreateInput) {
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

  @Post('/current/:id/send-text')
  async sendTextByUserRobotId(@UserId() userId: string, @Param('id') id: string, @Body() body: { text: string }) {
    return this.messageRobotService.sendTextByUserRobotId(userId, id, body.text)
  }

  @Post('/current/:id/send')
  async sendMessageByUserRobotId(@UserId() userId: string, @Param('id') id: string, @Body() body: object) {
    return this.messageRobotService.sendJSONByUserRobotId(userId, id, body)
  }

  @Post('/company/:companyId/robot')
  async addCompanyRobot(@Param('companyId') companyId: string, @Body() robot: MessageRobot) {
    return this.messageRobotService.addCompanyRobot(companyId, robot)
  }

  @Get('/company/:companyId/robot')
  async listCompanyRobots(@Param('companyId') companyId: string) {
    return this.messageRobotService.listCompanyRobots(companyId)
  }

  @Get('/company/:companyId/robot/:id')
  async getCompanyRobotById(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.messageRobotService.getCompanyRobotById(companyId, id)
  }

  @Put('/company/:companyId/robot/:id')
  async updateCompanyRobot(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() robot: Prisma.MessageRobotUncheckedUpdateInput
  ) {
    return this.messageRobotService.updateCompanyRobot(companyId, id, robot)
  }

  @Delete('/company/:companyId/robot/:id')
  async deleteCompanyRobot(@Param('companyId') companyId: string, @Param('id') id: string) {
    return this.messageRobotService.deleteUserRobot(companyId, id)
  }

  @Post('/company/:companyId/robot/:id/send-text')
  async sendTextByCompanyRobotId(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: { text: string }
  ) {
    return this.messageRobotService.sendTextByCompanyRobotId(companyId, id, body.text)
  }

  @Post('/company/:companyId/robot/:id/send')
  async sendMessageByCompanyRobotId(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: object
  ) {
    return this.messageRobotService.sendJSONByCompanyRobotId(companyId, id, body)
  }

  @Public()
  @Post('/custom-send')
  async customSend(@Body() formData: ICustomSendBody) {
    const { type, auth, body } = formData
    const result = await this.messageRobotService.sendJSONByFullConfig(
      type.toUpperCase() as MessageRobotType,
      body,
      auth
    )

    return result
  }
}
