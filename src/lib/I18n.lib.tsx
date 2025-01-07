import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const LANGUAGE_KEY = 'x-language'

interface Translation {
  [key: string]: string | number | boolean | Translation
}

interface I18n {
  language: string
  changeLanguage: (lang: string) => void
  t: (key: string) => string
}

export const I18nContext = createContext<I18n | null>(null)

type Props = { defaultLanguage: string; translations: Translation }
export const I18nProvider: FC<Props> = ({ defaultLanguage, translations, children }) => {
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || navigator.language.split('-')[0])

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]
    const storedLang = localStorage.getItem(LANGUAGE_KEY)

    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang)
      return
    }
    if (translations[browserLang]) {
      setLanguage(browserLang)
      return
    }
    setLanguage(defaultLanguage)
  }, [defaultLanguage, translations])

  const changeLanguage = useCallback(
    (lang: string) => {
      if (!translations[lang]) throw new Error(`You can't switch to an unconfigured language`)
      setLanguage(lang)
      localStorage.setItem(LANGUAGE_KEY, lang)
    },
    [translations]
  )

  const t = useCallback(
    (key: string) => {
      const keys = key.toString().split('.')
      let value = translations[language]
      for (const currentKey of keys) {
        if (!value || !value[key]) throw new Error('The key provided is incorrect')
        value = value[currentKey]
      }
      if (typeof value === 'number') return value.toString()
      if (typeof value === 'boolean') return String(value)
      if (typeof value !== 'string') throw new Error('The value of a key cannot be an object or array')
      return value
    },
    [language, translations]
  )

  const value = useMemo(() => ({ language, changeLanguage, t }), [changeLanguage, language, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useTranslation = () => {
  const context = useContext(I18nContext)
  if (context === null) {
    throw new Error('The I18n context is not initialized. Make sure you have the provider set up correctly.')
  }
  return context
}
