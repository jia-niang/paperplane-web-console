import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GitStaff {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ isArray: true, type: String })
  emails: string[] = []

  @ApiProperty({ isArray: true, type: String })
  alternativeNames: string[] = []

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null

  @ApiPropertyOptional({ type: String })
  gitProjectId: string | null
}
