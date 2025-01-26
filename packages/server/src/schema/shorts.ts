import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ShortsType } from '@prisma/client'

export class Shorts {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  url: string

  @ApiProperty({ type: String })
  key: string

  @ApiPropertyOptional({ type: Date })
  expiredAt: Date | null

  @ApiPropertyOptional({ enum: ShortsType, enumName: 'ShortsType' })
  type: ShortsType | null

  @ApiPropertyOptional({ type: String })
  userId: string | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
