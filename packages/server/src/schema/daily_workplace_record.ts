import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class DailyWorkplaceRecord {
  @ApiProperty({ type: String })
  id: string

  @ApiPropertyOptional({ type: String })
  todayWeather: string | null

  @ApiPropertyOptional({ type: String })
  todayTemperature: string | null

  @ApiPropertyOptional({ type: String })
  todayWid: string | null

  @ApiPropertyOptional({ type: String })
  tomorrowWeather: string | null

  @ApiPropertyOptional({ type: String })
  tomorrowTemperature: string | null

  @ApiPropertyOptional({ type: String })
  tomorrowWid: string | null

  @ApiPropertyOptional({ type: Number })
  h92: number | null

  @ApiPropertyOptional({ type: Number })
  h95: number | null

  @ApiPropertyOptional({ type: Number })
  h98: number | null

  @ApiPropertyOptional({ type: String })
  traffic: string | null

  @ApiPropertyOptional({ type: String })
  trafficImage: string | null

  @ApiPropertyOptional({ type: String })
  trafficViewUrl: string | null

  @ApiProperty({ type: String })
  workdayRecordId: string

  @ApiProperty({ type: String })
  workplaceId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
