const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'

function random(len: number, radix: number = alphabet.length): string {
  alphabet.split('')
  const uuid: string[] = []

  for (let i = 0; i < len; i++) {
    uuid[i] = alphabet[0 | (Math.random() * radix)]
  }

  return uuid.join('')
}

/** 十六进制随机 ID，默认长度为 8 */
export function hexId(len: number = 8) {
  return random(len, 16)
}

/** 数字和小写字母随机 ID，默认长度为 8 */
export function alphabetId(len: number = 8) {
  return random(len)
}
