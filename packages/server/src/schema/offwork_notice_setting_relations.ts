import { ApiProperty } from '@nestjs/swagger'

import { Company } from './company'
import { MessageRobot } from './message_robot'
import { OffworkNoticeMailSubscription } from './offwork_notice_mail_subscription'
import { Workplace } from './workplace'

export class OffworkNoticeSettingRelations {
  @ApiProperty({ type: () => MessageRobot })
  belongToRobot: MessageRobot

  @ApiProperty({ type: () => Company })
  belongToCompany: Company

  @ApiProperty({ type: () => Workplace })
  belongToWorkplace: Workplace

  @ApiProperty({ isArray: true, type: () => OffworkNoticeMailSubscription })
  allMailSubscriptions: OffworkNoticeMailSubscription[]
}
