import { HttpException } from '@nestjs/common'
import { Prisma } from '@repo/db'

export function getExceptionMessage(exception: HttpException): string {
  if (exception instanceof Prisma.PrismaClientValidationError) {
    return '数据验证失败，请检查输入数据和格式并重试。'
  } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    return '数据操作失败，请检查输入数据和格式并重试。'
  }

  return exception.message
}
