import { ApiProperty } from '@nestjs/swagger'

import { Company } from './company'
import { OffworkViewRecord } from './offwork_view_record'
import { WorkdayRecord } from './workday_record'

export class DailyCompanyRecordRelations {
  @ApiProperty({ type: () => WorkdayRecord })
  beloneToWorkday: WorkdayRecord

  @ApiProperty({ type: () => Company })
  belongToCompany: Company

  @ApiProperty({ isArray: true, type: () => OffworkViewRecord })
  allOffworkViewRecords: OffworkViewRecord[]
}
