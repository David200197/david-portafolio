import { useTranslation } from '@/lib/I18n.lib'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

type Props = { margin?: string }
export const ChangeLocales = ({ margin }: Props) => {
  const { language, changeLanguage, t } = useTranslation()
  return (
    <FormControl style={{ margin }} sx={{ m: 1, minWidth: 120 }} size='small'>
      <InputLabel id='demo-simple-select-label'>{t('language')}</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={language}
        label='Language'
        onChange={e => changeLanguage(e.target.value)}
      >
        <MenuItem value={'en'}>{t('en')}</MenuItem>
        <MenuItem value={'es'}>{t('es')}</MenuItem>
      </Select>
    </FormControl>
  )
}
