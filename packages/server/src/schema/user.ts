import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '@prisma/client'

export class User {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiPropertyOptional({ type: String })
  password: string | null

  @ApiProperty({ enum: Role, enumName: 'Role' })
  role: Role = Role.USER

  @ApiPropertyOptional({ type: String })
  githubId: string | null

  @ApiPropertyOptional({ type: String })
  giteaId: string | null

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiPropertyOptional({ type: Date })
  deletedAt: Date | null
}
