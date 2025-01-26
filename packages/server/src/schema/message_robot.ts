import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { MessageRobotType } from '@prisma/client'

export class MessageRobot {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ enum: MessageRobotType, enumName: 'MessageRobotType' })
  type: MessageRobotType

  @ApiPropertyOptional({ type: String })
  accessToken: string | null

  @ApiPropertyOptional({ type: String })
  secret: string | null

  @ApiPropertyOptional({ type: Object })
  extraAuthentication: object | null

  @ApiPropertyOptional({ type: String })
  desc: string | null

  @ApiPropertyOptional({ type: String })
  companyId: string | null

  @ApiPropertyOptional({ type: String })
  userId: string | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
