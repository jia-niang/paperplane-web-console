import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class DailyCompanyRecord {
  @ApiProperty({ type: String })
  id: string

  @ApiPropertyOptional({ type: String })
  salaryDate: string | null

  @ApiPropertyOptional({ type: Number })
  restDays: number | null

  @ApiPropertyOptional({ type: Number })
  todayStock: number | null

  @ApiPropertyOptional({ type: Number })
  yesterdayStock: number | null

  @ApiPropertyOptional({ type: Number })
  delta: number | null

  @ApiProperty({ type: String })
  workdayRecordId: string

  @ApiProperty({ type: String })
  companyId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
