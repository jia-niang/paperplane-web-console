import { ApiProperty } from '@nestjs/swagger'

import { GitRepo } from './git_repo'
import { GitReport } from './git_report'
import { GitStaff } from './git_staff'

export class GitProjectRelations {
  @ApiProperty({ isArray: true, type: () => GitRepo })
  repos: GitRepo[]

  @ApiProperty({ isArray: true, type: () => GitStaff })
  staffs: GitStaff[]

  @ApiProperty({ isArray: true, type: () => GitReport })
  GitReport: GitReport[]
}
