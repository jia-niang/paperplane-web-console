import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OffworkNoticeMailSubscription {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: Boolean })
  disabled: boolean

  @ApiProperty({ type: String })
  mail: string

  @ApiProperty({ type: String })
  label: string

  @ApiProperty({ type: String })
  offworkNoticeSettingId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
