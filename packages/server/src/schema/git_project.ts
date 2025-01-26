import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GitCommonStatus } from '@prisma/client'

export class GitProject {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ enum: GitCommonStatus, enumName: 'GitCommonStatus' })
  weeklyStatus: GitCommonStatus = GitCommonStatus.INIT

  @ApiPropertyOptional({ type: String })
  publicKey: string | null

  @ApiPropertyOptional({ type: String })
  privateKey: string | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
