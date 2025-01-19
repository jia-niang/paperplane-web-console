import bcrypt from 'bcrypt'
import crypto from 'crypto'

export async function bcryptHash(password: string) {
  return await bcrypt.hash(password, 5)
}

export async function bcryptCompare(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export function md5(input: string) {
  return crypto.createHash('md5').update(input).digest('hex')
}
