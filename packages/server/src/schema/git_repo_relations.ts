import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { GitCommit } from './git_commit'
import { GitProject } from './git_project'

export class GitRepoRelations {
  @ApiProperty({ isArray: true, type: () => GitCommit })
  recentCommits: GitCommit[]

  @ApiPropertyOptional({ type: () => GitProject })
  GitProject: GitProject | null
}
