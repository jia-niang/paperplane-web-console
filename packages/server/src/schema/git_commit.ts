import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GitCommit {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  hash: string

  @ApiProperty({ type: String })
  dateString: string

  @ApiProperty({ type: String })
  message: string

  @ApiProperty({ type: String })
  authorName: string

  @ApiProperty({ type: String })
  authorEmail: string

  @ApiPropertyOptional({ type: String })
  refs: string | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null

  @ApiPropertyOptional({ type: String })
  gitRepoId: string | null
}
