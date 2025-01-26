import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class WorkdayRecord {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  date: string

  @ApiProperty({ type: Boolean })
  isWorkDay: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
