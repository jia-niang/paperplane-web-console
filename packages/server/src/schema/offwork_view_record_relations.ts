import { ApiPropertyOptional } from '@nestjs/swagger'

import { Company } from './company'
import { DailyCompanyRecord } from './daily_company_record'
import { DailyWorkplaceRecord } from './daily_workplace_record'
import { WorkdayRecord } from './workday_record'
import { Workplace } from './workplace'

export class OffworkViewRecordRelations {
  @ApiPropertyOptional({ type: () => Company })
  company: Company | null

  @ApiPropertyOptional({ type: () => Workplace })
  workplace: Workplace | null

  @ApiPropertyOptional({ type: () => WorkdayRecord })
  workdayRecord: WorkdayRecord | null

  @ApiPropertyOptional({ type: () => DailyCompanyRecord })
  companyRecord: DailyCompanyRecord | null

  @ApiPropertyOptional({ type: () => DailyWorkplaceRecord })
  workplaceRecord: DailyWorkplaceRecord | null
}
