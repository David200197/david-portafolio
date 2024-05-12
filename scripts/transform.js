const fs = require('fs')

const data = `
<SocialLink title='GitHub' icon={GitHubIcon} to={'https://github.com/David200197'} />
<SocialLink title='LinkedIn' icon={LinkedInIcon} to={'https://www.linkedin.com/in/david-alfonso-pereira-40b350253/'} />
<SocialLink title='Telegram' icon={TelegramIcon} to={'https://t.me/Dafoneira'} />
<SocialLink title='WhatsApp' icon={WhatsAppIcon} to={'https://wa.me/qr/ETYTO7EVAJT6F1'} />
<SocialLink title='Download CV' icon={FileDownloadIcon} to={'https://drive.google.com/file/d/1lkw5GQdeoch6R-v96X8OsCqu4hyvBk9h/view?usp=drive_link'} />
`

const lines = data.split('\n')
const content = lines
  .filter(line => line)
  .map(line => {
    return `{${line
      .replace('<SocialLink', '')
      .replace('/>', '')
      .replace('={', ':')
      .replace('=', ':')
      .replace('}', ',')}}`
  })
  .join(',')
const json = `[${content}]`
fs.writeFileSync('base.json', json)
