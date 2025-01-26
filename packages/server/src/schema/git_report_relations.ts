import { ApiProperty } from '@nestjs/swagger'

import { GitProject } from './git_project'
import { GitStaff } from './git_staff'

export class GitReportRelations {
  @ApiProperty({ type: () => GitProject })
  beloneToProject: GitProject

  @ApiProperty({ type: () => GitStaff })
  beloneToStaff: GitStaff
}
