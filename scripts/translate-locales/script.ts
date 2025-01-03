import { input } from '../utils/input'
import { snakeCase } from '../utils/snakeCase'

import { ENGLISH, SPANISH } from './constants/languages'
import { generateNewTranslateLocal } from './utils/generate-new-translate-local'
import { translate } from './utils/translate'

const run = async () => {
  try {
    console.log('start script: translate-locales')
    console.log('--------------------------------')

    const isManual = process.argv.includes('-m') || process.argv.includes('--manual')

    const keyLocales = snakeCase(await input('Enter the name of the key locales'))

    const en = await input('Enter the word to translate (Must be in English)')

    const es = isManual ? await input('Enter the spanish translation') : await translate(en, SPANISH)

    generateNewTranslateLocal({
      target: ENGLISH,
      text: en,
      keyLocales
    })

    generateNewTranslateLocal({
      target: SPANISH,
      text: es,
      keyLocales
    })

    console.log(`locales created: ${keyLocales}`)
  } catch (error) {
    console.log(error)
  }
}
run()
