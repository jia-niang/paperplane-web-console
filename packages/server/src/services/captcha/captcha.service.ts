import { Injectable } from '@nestjs/common'
import { CaptchaGenerator } from 'captcha-canvas'

import { md5 } from '@/utils/crypto'

import { SignService } from '../sign/sign.service'

export interface ICaptchaOption extends ICaptchaImageOption {
  sessionId: string
  expiresIn: string
  audience: string
}

export interface ICaptchaResult {
  base64: string
  key: string
}

export interface ICaptchaCheckOption {
  sessionId: string
  audience: string
  code: string
  key: string
}

interface ICaptchaImageOption {
  height?: number
  width?: number
}

const CAPTCHA_REDIS_PREFIX = 'captcha:'

@Injectable()
export class CaptchaService {
  constructor(private readonly signService: SignService) {}

  async captcha(options: ICaptchaOption): Promise<ICaptchaResult> {
    const { sessionId, expiresIn, audience } = options
    const { base64, code } = await this.makeImage(options)

    const jwtid = CAPTCHA_REDIS_PREFIX + md5(`${process.env.SERVER_SECRET}$${sessionId}`)
    const subject = md5(`${process.env.SERVER_SECRET}$${code}`)
    const key = await this.signService.sign({}, { audience, subject, expiresIn, jwtid })

    return { base64, key }
  }

  async check(options?: ICaptchaCheckOption) {
    const { audience, code, key, sessionId } = { ...options }

    const jwtid = CAPTCHA_REDIS_PREFIX + md5(`${process.env.SERVER_SECRET}$${sessionId}`)
    const subject = md5(`${process.env.SERVER_SECRET}$${code}`)
    const isOk = await this.signService.check(key!, { audience, subject, jwtid }).catch(() => null)

    return !!isOk
  }

  async makeImage(options: ICaptchaImageOption) {
    // 使用文档： https://captcha-canvas.js.org/

    const color = `#9b3db3`
    const captcha = new CaptchaGenerator(options).setCaptcha({ color }).setDecoy({ color }).setTrace({ color })
    const buffer = await captcha.generate()
    const base64 = `data:image/png;base64,` + buffer.toString('base64')
    const code = captcha.text

    return { base64, code }
  }
}
