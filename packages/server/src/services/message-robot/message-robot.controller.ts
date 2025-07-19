import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { MessageRobotType, Prisma } from '@repo/db'

import { Public, UserId } from '@/app/auth.decorator'
import { StaffRole } from '@/app/role.decorator'

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

  @Post('/current/:id/send-text')
  async sendTextByUserRobotId(@UserId() userId: string, @Param('id') id: string, @Body() body: { text: string }) {
    return this.messageRobotService.sendTextByUserRobotId(userId, id, body.text)
  }

  @Post('/current/:id/send')
  async sendMessageByUserRobotId(@UserId() userId: string, @Param('id') id: string, @Body() body: object) {
    return this.messageRobotService.sendJSONByUserRobotId(userId, id, body)
  }

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

  @StaffRole()
  @Post('/company/:companyId/robot/:id/send-text')
  async sendTextByCompanyRobotId(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() body: { text: string }
  ) {
    return this.messageRobotService.sendTextByCompanyRobotId(companyId, id, body.text)
  }

  @StaffRole()
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
