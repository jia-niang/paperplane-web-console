export function hexId(len: number = 8): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
  const uuid: string[] = []
  const radix = 16

  for (let i = 0; i < len; i++) {
    uuid[i] = chars[0 | (Math.random() * radix)]
  }

  return uuid.join('')
}
