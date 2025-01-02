declare namespace NodeJS {
  interface ProcessEnv {
    /** 运行环境，请使用 `production` 来判断 */
    readonly NODE_ENV: 'development' | 'production'
  }
}

// import { OnModuleInit } from '@nestjs/common'
// import { Prisma, PrismaClient } from '@repo/db'
// import { PrismaServiceOptions } from 'nestjs-prisma'

// declare module 'nestjs-prisma' {
//   declare class PrismaService
//     extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>
//     implements OnModuleInit
//   {
//     private readonly prismaServiceOptions
//     constructor(prismaServiceOptions?: PrismaServiceOptions)
//     onModuleInit(): Promise<void>
//   }
// }
