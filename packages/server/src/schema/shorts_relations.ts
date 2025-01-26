import { ApiPropertyOptional } from '@nestjs/swagger'

import { User } from './user'

export class ShortsRelations {
  @ApiPropertyOptional({ type: () => User })
  author: User | null
}
