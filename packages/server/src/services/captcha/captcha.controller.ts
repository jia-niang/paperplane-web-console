import { Body, Controller, Get, Post, Session } from '@nestjs/common'

import { IAppSession } from '../auth/auth.service'
import { CaptchaService } from './captcha.service'

@Controller('/captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  async create(@Session() session: IAppSession) {
    return this.captchaService.captcha({
      sessionId: session.id,
      expiresIn: '10m',
      audience: 'test',
    })
  }

  @Post()
  async check(@Session() session: IAppSession, @Body() body: { key: string; code: string }) {
    return this.captchaService.check({ code: body.code, key: body.key, sessionId: session.id, audience: 'test' })
  }
}
