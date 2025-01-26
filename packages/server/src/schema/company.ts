import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class Company {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  company: string

  @ApiPropertyOptional({ type: String })
  stockCode: string | null

  @ApiPropertyOptional({ type: Number })
  salaryDate: number | null

  @ApiPropertyOptional({ type: Number })
  offworkTimeOfDay: number | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
