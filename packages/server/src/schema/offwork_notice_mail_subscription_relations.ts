import { ApiProperty } from '@nestjs/swagger'

import { OffworkNoticeSetting } from './offwork_notice_setting'

export class OffworkNoticeMailSubscriptionRelations {
  @ApiProperty({ type: () => OffworkNoticeSetting })
  belongToSetting: OffworkNoticeSetting
}
