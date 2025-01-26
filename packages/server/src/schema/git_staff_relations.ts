import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'

import { GitProject } from './git_project'
import { GitReport } from './git_report'

export class GitStaffRelations {
  @ApiPropertyOptional({ type: () => GitProject })
  GitProject: GitProject | null

  @ApiProperty({ isArray: true, type: () => GitReport })
  GitReport: GitReport[]
}
