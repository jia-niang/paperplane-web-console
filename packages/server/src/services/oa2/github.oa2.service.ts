import axios, { CreateAxiosDefaults } from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

import { hexId } from '@/utils/random'

import { SignService } from '../sign/sign.service'
import { IOAuthCallbackOption, IOAuthCallbackResult, IOAuthHrefOption } from './oa2.service'

const gitHubClientBaseOption: CreateAxiosDefaults = {
  httpsAgent: process.env.GITHUB_PROXY_URL ? new HttpsProxyAgent(process.env.GITHUB_PROXY_URL) : undefined,
  headers: { Accept: 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
}

export default class GitHubOAuthService {
  private ghClient = axios.create({ ...gitHubClientBaseOption })

  constructor(private readonly signService: SignService) {}

  async oauthHref(option: IOAuthHrefOption): Promise<string> {
    const { redirectUri, scope, audience, state } = option
    const redirect_uri = redirectUri.startsWith('http') ? redirectUri : process.env.SERVICE_URL + redirectUri
    const stateToken = await this.signService.sign({ jti: hexId(12), ...state }, { expiresIn: '10m', audience })

    const query = new URLSearchParams({
      client_id: process.env.GITHUB_OA2_CLIENT_ID!,
      redirect_uri,
      scope,
      state: stateToken,
    })
    const url = `https://github.com/login/oauth/authorize?${query}`

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

    const codeResult = await this.ghClient
      .post<{ access_token: string; scope: string; token_type: string }>(
        `https://github.com/login/oauth/access_token`,
        {
          client_id: process.env.GITHUB_OA2_CLIENT_ID,
          client_secret: process.env.GITHUB_OA2_CLIENT_SECRET,
          redirect_uri,
          code,
        }
      )
      .then(res => res.data)

    const accessToken = codeResult.access_token

    const client = axios.create({
      ...gitHubClientBaseOption,
      baseURL: `https://api.github.com`,
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    return { accessToken, client, state }
  }
}
