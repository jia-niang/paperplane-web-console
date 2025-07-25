export function getFileExtension(filename: string = '') {
  const lastDot = filename.lastIndexOf('.')

  if (lastDot === -1 || lastDot === 0) {
    return ''
  }

  return filename.slice(lastDot + 1)
}
