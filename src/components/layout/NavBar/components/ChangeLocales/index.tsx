import { useTranslation } from 'react-i18n-thin'
import { FormControl } from '@mui/material'
import { LanguageSwitch } from './styled'
import { useEffect, useRef } from 'react'

type Props = { margin?: string }
export const ChangeLocales = ({ margin }: Props) => {
  const { language, changeLanguage, t } = useTranslation()
  const defaultLangue = useRef(language).current

  useEffect(() => {
    document.title = t('portfolio')
  }, [language, t])

  const onClick = () => {
    changeLanguage(language === 'en' ? 'es' : 'en')
  }

  return (
    <FormControl style={{ margin }} sx={{ m: 1, minWidth: 120 }} size='small'>
      <LanguageSwitch onClick={onClick} value={language === 'en'} defaultChecked={defaultLangue === 'en'} />
    </FormControl>
  )
}
