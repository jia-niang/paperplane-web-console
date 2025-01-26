import { ApiProperty } from '@nestjs/swagger'

import { Company } from './company'
import { DailyWorkplaceRecord } from './daily_workplace_record'
import { OffworkNoticeSetting } from './offwork_notice_setting'
import { OffworkViewRecord } from './offwork_view_record'

export class WorkplaceRelations {
  @ApiProperty({ type: () => Company })
  belongToCompany: Company

  @ApiProperty({ isArray: true, type: () => DailyWorkplaceRecord })
  allDailyRecords: DailyWorkplaceRecord[]

  @ApiProperty({ isArray: true, type: () => OffworkNoticeSetting })
  OffworkNoticeSetting: OffworkNoticeSetting[]

  @ApiProperty({ isArray: true, type: () => OffworkViewRecord })
  allOffworkViewRecords: OffworkViewRecord[]
}
