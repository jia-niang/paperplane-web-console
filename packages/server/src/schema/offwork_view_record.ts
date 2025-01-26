import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OffworkViewRecord {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  date: string

  @ApiProperty({ type: String })
  imageUrl: string

  @ApiProperty({ type: String })
  viewUrl: string

  @ApiProperty({ type: String })
  shortUrl: string

  @ApiProperty({ type: String })
  trafficImageUrl: string

  @ApiPropertyOptional({ type: String })
  companyId: string | null

  @ApiPropertyOptional({ type: String })
  workplaceId: string | null

  @ApiPropertyOptional({ type: String })
  workdayRecordId: string | null

  @ApiPropertyOptional({ type: String })
  dailyCompanyRecordId: string | null

  @ApiPropertyOptional({ type: String })
  dailyWorkplaceRecordId: string | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
