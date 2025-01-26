import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OffworkNoticeSetting {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: Boolean })
  disabled: boolean

  @ApiProperty({ type: String })
  messageRobotId: string

  @ApiProperty({ type: String })
  companyId: string

  @ApiProperty({ type: String })
  workplaceId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
