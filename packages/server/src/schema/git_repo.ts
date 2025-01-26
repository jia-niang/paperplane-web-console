import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GitCommonStatus } from '@prisma/client'

export class GitRepo {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  url: string

  @ApiProperty({ enum: GitCommonStatus, enumName: 'GitCommonStatus' })
  status: GitCommonStatus = GitCommonStatus.INIT

  @ApiPropertyOptional({ type: Date })
  lastSync: Date | null

  @ApiProperty({ isArray: true, type: String })
  recentBranches: string[] = []

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null

  @ApiPropertyOptional({ type: String })
  gitProjectId: string | null
}
