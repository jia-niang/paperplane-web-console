import { ApiProperty } from '@nestjs/swagger'

import { DailyCompanyRecord } from './daily_company_record'
import { DailyWorkplaceRecord } from './daily_workplace_record'
import { OffworkViewRecord } from './offwork_view_record'

export class WorkdayRecordRelations {
  @ApiProperty({ isArray: true, type: () => DailyCompanyRecord })
  allCompanyRecords: DailyCompanyRecord[]

  @ApiProperty({ isArray: true, type: () => DailyWorkplaceRecord })
  allWorkplaceRecords: DailyWorkplaceRecord[]

  @ApiProperty({ isArray: true, type: () => OffworkViewRecord })
  allOffworkViewRecords: OffworkViewRecord[]
}
