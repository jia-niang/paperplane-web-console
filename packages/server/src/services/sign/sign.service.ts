import { Injectable } from '@nestjs/common'
import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'

import { RedisService } from '../redis/redis.service'

const SIGN_JTI_PREFIX = 'sign-cache-jti:'

@Injectable()
export class SignService {
  constructor(private readonly redis: RedisService) {}

  async sign(payload: JwtPayload, options: SignOptions = {}) {
    const token = jwt.sign(payload, process.env.SERVER_SECRET!, options)
    const resultJwt = jwt.verify(token, process.env.SERVER_SECRET!, options) as JwtPayload

    if (!resultJwt.jti) {
      return token
    }

    if (!resultJwt.exp) {
      throw new Error(`使用 jti 时，必须指定过期时间`)
    }
    await this.redis.set(SIGN_JTI_PREFIX + resultJwt.jti, token, 'EXAT', resultJwt.exp)

    return token
  }

  async check(token: string, options: VerifyOptions = {}) {
    const payload = jwt.verify(token, process.env.SERVER_SECRET!, options) as JwtPayload

    if (!payload.jti) {
      return payload
    }

    const cachedToken = await this.redis.get(SIGN_JTI_PREFIX + payload.jti)
    if (!cachedToken || cachedToken !== token) {
      throw new Error('此 sign 已失效')
    }
    await this.redis.del(SIGN_JTI_PREFIX + payload.jti)

    return payload
  }
}
