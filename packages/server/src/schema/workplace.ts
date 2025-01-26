import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class Workplace {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  city: string

  @ApiPropertyOptional({ type: String })
  weatherCode: string | null

  @ApiPropertyOptional({ type: String })
  oilpriceCode: string | null

  @ApiPropertyOptional({ type: String })
  mapLatitude: string | null

  @ApiPropertyOptional({ type: String })
  mapLongitude: string | null

  @ApiProperty({ type: String })
  companyId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
