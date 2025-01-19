import axios, { CreateAxiosDefaults } from 'axios'

import { hexId } from '@/utils/random'

import { SignService } from '../sign/sign.service'
import { IOAuthCallbackOption, IOAuthCallbackResult, IOAuthHrefOption } from './oa2.service'

const giteaClientBaseOption: CreateAxiosDefaults = {
  headers: { Accept: 'application/json' },
}

export default class GiteaOAuthService {
  private giteaClient = axios.create({ ...giteaClientBaseOption })

  constructor(private readonly signService: SignService) {}

  async oauthHref(option: IOAuthHrefOption): Promise<string> {
    const { redirectUri, scope, audience, state } = option
    const redirect_uri = redirectUri.startsWith('http') ? redirectUri : process.env.SERVICE_URL + redirectUri
    const stateToken = await this.signService.sign({ jti: hexId(12), ...state }, { expiresIn: '10m', audience })

    const query = new URLSearchParams({
      client_id: process.env.GITEA_OA2_CLIENT_ID!,
      redirect_uri,
      scope,
      state: stateToken,
      response_type: 'code',
    })
    const url = `https://git.paperplane.cc/login/oauth/authorize?${query}`

    return url
  }

  async oauthCallback<TState extends Record<string, any> = any>(
    code: string,
    stateToken: string,
    option: IOAuthCallbackOption
  ): Promise<IOAuthCallbackResult<TState>> {
    const { redirectUri, audience } = option
    const redirect_uri =
      !redirectUri || redirectUri.startsWith('http') ? redirectUri : process.env.SERVICE_URL + redirectUri

    const state = (await this.signService.check(stateToken, { audience })) as TState

    const codeResult = await this.giteaClient
      .post<{ access_token: string; scope: string; token_type: string }>(
        `https://git.paperplane.cc/login/oauth/access_token`,
        {
          client_id: process.env.GITEA_OA2_CLIENT_ID,
          client_secret: process.env.GITEA_OA2_CLIENT_SECRET,
          redirect_uri,
          grant_type: 'authorization_code',
          code,
        }
      )
      .then(res => res.data)

    const accessToken = codeResult.access_token

    const client = axios.create({
      ...giteaClientBaseOption,
      baseURL: `https://git.paperplane.cc/api/v1`,
      headers: { Authorization: `token ${accessToken}` },
    })

    return { accessToken, client, state }
  }
}
