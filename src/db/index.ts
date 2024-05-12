import { Db } from '@/interface/db'
import {
  ApolloSvg,
  CssSvg,
  ExpressSvg,
  GraphqlSvg,
  HtmlSvg,
  JavascriptSvg,
  MaterialUISvg,
  NestSvg,
  NextSvg,
  NodeSvg,
  ReactSvg,
  SassSvg,
  TailwindSvg,
  TypescriptSvg
} from '@/components/svg'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

const db: Db = {
  profile: {
    avatar: 'avatar.svg',
    description:
      'Hi! I am David Alfonso Pereira, a fullstack developer with more than 3 years of experience, master various technologies and with a teamwork mentality'
  },
  socials: [
    { title: 'GitHub', icon: GitHubIcon, to: 'https://github.com/David200197' },
    { title: 'LinkedIn', icon: LinkedInIcon, to: 'https://www.linkedin.com/in/david-alfonso-pereira-40b350253/' },
    { title: 'Telegram', icon: TelegramIcon, to: 'https://t.me/Dafoneira' },
    { title: 'WhatsApp', icon: WhatsAppIcon, to: 'https://wa.me/qr/ETYTO7EVAJT6F1' },
    {
      title: 'Download CV',
      icon: FileDownloadIcon,
      to: 'https://drive.google.com/file/d/1lkw5GQdeoch6R-v96X8OsCqu4hyvBk9h/view?usp=drive_link'
    }
  ],
  skills: [
    {
      icon: JavascriptSvg,
      title: 'Javascript',
      to: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/First_steps/What_is_JavaScript'
    },
    { icon: HtmlSvg, title: 'Html', to: 'https://www.w3.org/html/' },
    { icon: CssSvg, title: 'Css', to: 'https://www.w3.org/Style/CSS/Overview.en.html' },
    { icon: TypescriptSvg, title: 'Typescript', to: 'https://www.typescriptlang.org/' },
    { icon: NodeSvg, title: 'Node', to: 'https://nodejs.org/en/' },
    { icon: ReactSvg, title: 'React', to: 'https://reactjs.org/' },
    { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/' },
    { icon: MaterialUISvg, title: 'Material-ui', to: 'https://mui.com/' },
    { icon: ExpressSvg, title: 'Express', to: 'https://expressjs.com/' },
    { icon: TailwindSvg, title: 'Tailwind', to: 'https://tailwindcss.com/' },
    { icon: NestSvg, title: 'Nest', to: 'https://nestjs.com/' },
    { icon: ApolloSvg, title: 'Apollo', to: 'https://www.apollographql.com/' },
    { icon: GraphqlSvg, title: 'Graphql', to: 'https://graphql.org/' },
    { icon: SassSvg, title: 'Sass', to: 'https://sass-lang.com/' }
  ],
  jobs: [
    {
      alt: 'teigee',
      logoSrc: 'teigee.webp',
      description:
        'Teigee is a platform to search, compare and review products, activities and characteristics from local businesses around you. We collaborate closely with our partners to keep our information trustworthy and up to date.',
      image: 'work-001.png',
      title: 'Teigee',
      time: 'January 2021 - Present',
      skills: [
        { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/' },
        { icon: MaterialUISvg, title: 'Material-ui', to: 'https://mui.com/' },
        { icon: GraphqlSvg, title: 'Graphql', to: 'https://graphql.org/' }
      ],
      link: 'http://www.teigee.com'
    },
    {
      alt: 'luvsuite',
      logoSrc: 'luvsuite.webp',
      description:
        'Luvsuite is an application that allows users to find and book accommodation online. It offers a wide variety of accommodation options, from hotels and motels to apartments, houses or private rooms.',
      image: 'work-003.webp',
      title: 'Luvsuit',
      time: 'December 2022 - May 2023',
      skills: [{ icon: NextSvg, title: 'Next', to: 'https://nextjs.org/' }]
    },
    {
      alt: '',
      logoSrc: 'leiizy.webp',
      description:
        'Leiizy is an AI-powered content generation platform that utilizes ChatGPT technology to help users create custom content for various tasks, such as writing emails, crafting social media posts, or composing video descriptions.',
      image: 'work-002.png',
      title: 'Leiizy',
      time: 'Febrary 2023 - Present',
      skills: [
        { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/' },
        { icon: MaterialUISvg, title: 'Material-ui', to: 'https://mui.com/' }
      ],
      link: 'https://www.leiizy.com'
    }
  ]
}
export default db
