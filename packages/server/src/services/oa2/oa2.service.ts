import { Injectable } from '@nestjs/common'
import type { AxiosInstance } from 'axios'

import { SignService } from '../sign/sign.service'
import GiteaOAuthService from './gitea.oa2.service'
import GitHubOAuthService from './github.oa2.service'

export interface IOAuthHrefOption<TState extends Record<string, any> = any> {
  redirectUri: string
  scope: string
  audience?: string
  state?: TState
}

export interface IOAuthCallbackOption {
  redirectUri?: string
  audience?: string
}

export interface IOAuthCallbackResult<TState extends Record<string, any> = any> {
  accessToken: string
  client: AxiosInstance
  state: TState
}

@Injectable()
export class OA2Service {
  gitHub: GitHubOAuthService
  gitea: GiteaOAuthService

  constructor(private readonly signService: SignService) {
    this.gitHub = new GitHubOAuthService(signService)
    this.gitea = new GiteaOAuthService(signService)
  }
}
