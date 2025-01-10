import { useTranslation } from 'react-i18n-thin'
import { FormControl } from '@mui/material'
import { LanguageSwitch } from './styled'

type Props = { margin?: string }
export const ChangeLocales = ({ margin }: Props) => {
  const { language, changeLanguage } = useTranslation()

  const onClick = () => {
    changeLanguage(language === 'en' ? 'es' : 'en')
  }

  return (
    <FormControl style={{ margin }} sx={{ m: 1, minWidth: 120 }} size='small'>
      <LanguageSwitch onClick={onClick} defaultChecked={language === 'en'} />
    </FormControl>
  )
}
