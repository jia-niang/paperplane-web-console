import { ApiProperty } from '@nestjs/swagger'

import { OffworkViewRecord } from './offwork_view_record'
import { WorkdayRecord } from './workday_record'
import { Workplace } from './workplace'

export class DailyWorkplaceRecordRelations {
  @ApiProperty({ type: () => WorkdayRecord })
  belongToWorkday: WorkdayRecord

  @ApiProperty({ type: () => Workplace })
  belongToWorkplace: Workplace

  @ApiProperty({ isArray: true, type: () => OffworkViewRecord })
  allOffworkViewRecords: OffworkViewRecord[]
}
