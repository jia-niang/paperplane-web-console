import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'

import { Company } from './company'
import { OffworkNoticeSetting } from './offwork_notice_setting'
import { User } from './user'

export class MessageRobotRelations {
  @ApiPropertyOptional({ type: () => Company })
  belongToCompany: Company | null

  @ApiPropertyOptional({ type: () => User })
  belongToUser: User | null

  @ApiProperty({ isArray: true, type: () => OffworkNoticeSetting })
  allSettings: OffworkNoticeSetting[]
}
