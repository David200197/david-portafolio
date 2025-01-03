import path from 'path'
import fs from 'fs'

export const createFile = (filePath: string, content: string) => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content)
}
