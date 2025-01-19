import { HttpException, Injectable } from '@nestjs/common'
import { Role, User } from '@repo/db'
import { PrismaService } from 'nestjs-prisma'

import { bcryptCompare, bcryptHash } from '@/utils/crypto'

import { isPrecofigAdmin } from '../auth/preconfig-admin'
import { OA2Service } from '../oa2/oa2.service'

const userSelector = {
  id: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oa2Service: OA2Service
  ) {}

  async addUser(user: User) {
    const hasSameName = await this.prisma.user.findFirst({ where: { name: user.name } })
    if (hasSameName) {
      throw new HttpException('用户名已存在', 409)
    }

    const password = await bcryptHash(user.password!)
    const newUser = { name: user.name, password, role: Role.USER }

    return this.prisma.user.create({ data: newUser, select: userSelector })
  }

  async addGitHubUser(email: string, githubId: string) {
    const user: Partial<User> = { name: email, githubId, role: Role.USER }

    const hasSameName = await this.prisma.user.findFirst({ where: { OR: [{ name: user.name }, { githubId }] } })
    if (hasSameName) {
      throw new HttpException('用户名已存在', 409)
    }

    return this.prisma.user.create({ data: user as User, select: userSelector })
  }

  async getUserById<T = User>(id: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { id },
      select: userSelector,
    }) as unknown as Promise<T>
  }

  async getUserByGitHubId<T = User>(githubId: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { githubId },
      select: userSelector,
    }) as unknown as Promise<T>
  }

  async getUserByGiteaId<T = User>(giteaId: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { giteaId },
      select: userSelector,
    }) as unknown as Promise<T>
  }

  async checkPwd(username: string, password: string) {
    const user = await this.prisma.user.findFirstOrThrow({ where: { name: username } })
    const isOK = await bcryptCompare(password, user?.password || '')

    if (!isOK) {
      return null
    }

    return (await this.prisma.user.findFirst({ where: { id: user.id }, select: userSelector })) as User
  }

  async ghLoginHref(options: { nextUrl: string }) {
    return this.oa2Service.gitHub.oauthHref({
      redirectUri: `/user/login/github/callback`,
      scope: `user:email`,
      audience: `gh_login`,
      state: { nextUrl: options.nextUrl },
    })
  }

  async ghLoginCb(code: string, stateToken: string) {
    const { state, client } = await this.oa2Service.gitHub.oauthCallback<{ nextUrl: string }>(code, stateToken, {
      redirectUri: `/user/login/github/callback`,
      audience: `gh_login`,
    })

    const githubResult = await client.get<{ id: number; email: string }>(`/user`).then(res => res.data)
    const githubId = String(githubResult.id)
    const user = await this.getUserByGitHubId(githubId)

    return { nextUrl: state.nextUrl, user }
  }

  async giteaLoginHref(options: { nextUrl: string }) {
    return this.oa2Service.gitea.oauthHref({
      redirectUri: `/user/login/gitea/callback`,
      scope: `user:email`,
      audience: `gitea_login`,
      state: { nextUrl: options.nextUrl },
    })
  }

  async giteaLoginCb(code: string, stateToken: string) {
    const { state, client } = await this.oa2Service.gitea.oauthCallback<{ nextUrl: string }>(code, stateToken, {
      redirectUri: `/user/login/gitea/callback`,
      audience: `gitea_login`,
    })

    const giteaResult = await client.get<{ id: number; email: string }>(`/user`).then(res => res.data)
    const giteaId = String(giteaResult.id)
    const user = await this.getUserByGiteaId(giteaId)

    return { nextUrl: state.nextUrl, user }
  }

  async ensureStaffRole(userId: string, throwError?: string | Error) {
    if (isPrecofigAdmin(userId)) {
      return true
    }

    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
      throw new Error('此用户不存在')
    } else if (user.role === Role.ADMIN || user.role === Role.STAFF) {
      return true
    } else if (throwError) {
      throw typeof throwError === 'string' ? new Error(throwError) : throwError
    }

    return false
  }

  async ensureAdminRole(userId: string, throwError?: string | Error) {
    if (isPrecofigAdmin(userId)) {
      return true
    }

    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
      throw new Error('此用户不存在')
    } else if (user.role === Role.ADMIN) {
      return true
    } else if (throwError) {
      throw typeof throwError === 'string' ? new Error(throwError) : throwError
    }

    return false
  }
}
