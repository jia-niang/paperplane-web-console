import { ApiPropertyOptional } from '@nestjs/swagger'

import { GitRepo } from './git_repo'

export class GitCommitRelations {
  @ApiPropertyOptional({ type: () => GitRepo })
  GitRepo: GitRepo | null
}
