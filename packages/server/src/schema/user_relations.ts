import { ApiProperty } from '@nestjs/swagger'

import { MessageRobot } from './message_robot'
import { Shorts } from './shorts'

export class UserRelations {
  @ApiProperty({ isArray: true, type: () => MessageRobot })
  MessageRobot: MessageRobot[]

  @ApiProperty({ isArray: true, type: () => Shorts })
  Shorts: Shorts[]
}
