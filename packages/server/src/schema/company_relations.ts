import { ApiProperty } from '@nestjs/swagger'

import { DailyCompanyRecord } from './daily_company_record'
import { MessageRobot } from './message_robot'
import { OffworkNoticeSetting } from './offwork_notice_setting'
import { OffworkViewRecord } from './offwork_view_record'
import { Workplace } from './workplace'

export class CompanyRelations {
  @ApiProperty({ isArray: true, type: () => DailyCompanyRecord })
  allDailyRecords: DailyCompanyRecord[]

  @ApiProperty({ isArray: true, type: () => Workplace })
  allWorkplaces: Workplace[]

  @ApiProperty({ isArray: true, type: () => MessageRobot })
  allMessageRobots: MessageRobot[]

  @ApiProperty({ isArray: true, type: () => OffworkNoticeSetting })
  allOffworkNoticeSettings: OffworkNoticeSetting[]

  @ApiProperty({ isArray: true, type: () => OffworkViewRecord })
  allOffworkViewRecords: OffworkViewRecord[]
}
