import { readFileSync, writeFileSync } from 'fs'
import { __dirname } from '../../utils/dirname'
import { join } from 'path'
import { sortObject } from '../../utils/sort-object'
import { capitalCase } from '../../utils/capitalCase'

type Props = { target: string; text: string; keyLocales: string }
export const generateNewTranslateLocal = ({ target, text, keyLocales }: Props) => {
  const localesDir = join(__dirname, 'src', 'locales')
  const jsonDir = join(localesDir, `${target}.json`)
  const locales = JSON.parse(readFileSync(jsonDir, { encoding: 'utf-8' }))
  locales[keyLocales] = capitalCase(text)
  const sortedLocales = sortObject(locales)
  writeFileSync(jsonDir, JSON.stringify(sortedLocales, null, 4))
}
