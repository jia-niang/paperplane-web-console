import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GitReport {
  @ApiProperty({ type: String })
  id: string

  @ApiPropertyOptional({ type: String })
  content: string | null

  @ApiProperty({ type: String })
  gitProjectId: string

  @ApiProperty({ type: String })
  gitStaffId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
