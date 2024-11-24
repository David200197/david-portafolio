import {
  AdonisSvg,
  ApolloSvg,
  CapacitorJsSvg,
  CssSvg,
  ExpressSvg,
  GraphqlSvg,
  HtmlSvg,
  JavascriptSvg,
  MaterialUISvg,
  NestSvg,
  NextSvg,
  NodeSvg,
  PlasmoSvg,
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
import { Db } from '@/interface/db'

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
      to: '/david-portafolio/cv.pdf'
    }
  ],
  skills: [
    {
      icon: JavascriptSvg,
      title: 'Javascript',
      to: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/First_steps/What_is_JavaScript',
      leftTooltip: '30px'
    },
    { icon: HtmlSvg, title: 'Html', to: 'https://www.w3.org/html/', leftTooltip: '30px' },
    { icon: CssSvg, title: 'Css', to: 'https://www.w3.org/Style/CSS/Overview.en.html', leftTooltip: '30px' },
    { icon: TypescriptSvg, title: 'Typescript', to: 'https://www.typescriptlang.org/', leftTooltip: '30px' },
    { icon: NodeSvg, title: 'Node', to: 'https://nodejs.org/en/', leftTooltip: '30px' },
    { icon: ReactSvg, title: 'React', to: 'https://reactjs.org/', leftTooltip: '30px' },
    { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', leftTooltip: '30px' },
    { icon: MaterialUISvg, title: 'Material-ui', to: 'https://mui.com/', leftTooltip: '30px' },
    { icon: ExpressSvg, title: 'Express', to: 'https://expressjs.com/', leftTooltip: '30px' },
    { icon: TailwindSvg, title: 'Tailwind', to: 'https://tailwindcss.com/', leftTooltip: '30px' },
    { icon: NestSvg, title: 'Nest', to: 'https://nestjs.com/', leftTooltip: '30px' },
    { icon: ApolloSvg, title: 'Apollo', to: 'https://www.apollographql.com/', leftTooltip: '30px' },
    { icon: GraphqlSvg, title: 'Graphql', to: 'https://graphql.org/', leftTooltip: '30px' },
    { icon: SassSvg, title: 'Sass', to: 'https://sass-lang.com/', leftTooltip: '30px' },
    { icon: AdonisSvg, title: 'Adonis', to: 'https://adonisjs.com/', leftTooltip: '30px' },
    { icon: PlasmoSvg, title: 'Plasmo', to: 'https://docs.plasmo.com/', leftTooltip: '30px' },
    { icon: CapacitorJsSvg, title: 'Capacitor', to: 'https://capacitorjs.com/', leftTooltip: '30px' }
  ],
  jobs: [
    {
      alt: 'teigee',
      logoSrc: 'teigee.webp',
      description:
        'Teigee is a platform to search, compare and review products, activities and characteristics from local businesses around you. We collaborate closely with our partners to keep our information trustworthy and up to date.',
      image: 'work-001.png',
      title: 'Teigee',
      time: 'January 2021 - January 2024',
      skills: [
        { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', showMobileText: false },
        { icon: MaterialUISvg, title: 'Material-ui', to: 'https://mui.com/', showMobileText: false },
        { icon: GraphqlSvg, title: 'Graphql', to: 'https://graphql.org/', showMobileText: false }
      ],
      //link: 'http://www.teigee.com',
      type: 'Frontend Developer'
    },
    {
      alt: 'leiizy',
      logoSrc: 'leiizy.webp',
      description:
        'Leiizy is an AI-powered content generation platform that utilizes ChatGPT technology to help users create custom content for various tasks, such as writing emails, crafting social media posts, or composing video descriptions.',
      image: 'work-002.png',
      title: 'Leiizy',
      time: 'Febrary 2023 - January 2024',
      skills: [
        { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', showMobileText: false },
        { icon: MaterialUISvg, title: 'Material-ui', to: 'https://mui.com/', showMobileText: false }
      ],
      link: 'https://www.leiizy.com',
      type: 'Frontend Developer'
    },
    {
      alt: 'eneldo laboral',
      logoSrc: 'eneldo_laboral.svg',
      description:
        'Eneldo Laborar is a complete job board management system designed to connect companies and job seekers efficiently. It offers a comprehensive platform to manage the entire hiring process, from posting job offers to selecting and hiring candidates.',
      image: 'work-004.png',
      title: 'Eneldo Laboral',
      time: 'November 2023 - Present',
      skills: [{ icon: NestSvg, title: 'Nest', to: 'https://nestjs.com/' }],
      type: 'Backend Developer'
    },
    {
      alt: 'construccions precises',
      logoSrc: 'construccions_precises.svg',
      description:
        'Construccions Precises is designed specifically to meet the unique budget management needs of architecture firms. With powerful features and an easy-to-use interface, the app allows architects and project managers to control and optimize their budgets efficiently.',
      image: 'work-005.png',
      title: 'Construccions Precises',
      time: 'January 2024 - Present',
      skills: [{ icon: NestSvg, title: 'Nest', to: 'https://nestjs.com/' }],
      type: 'Backend Developer'
    },
    {
      alt: 'ibx',
      logoSrc: 'ibx.svg',
      description:
        'IBX is a trading platform that offers investors access to multiple global markets, as well as a wide range of assets, such as: stocks, advanced technical and chart analysis tools, sophisticated order types and ultra-fast operations execution',
      image: 'work-003.png',
      title: 'Ibx',
      time: 'March 2024 - Present',
      skills: [{ icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', showMobileText: false }],
      link: 'https://app.ibx.exchange/',
      type: 'Frontend Developer'
    },
    {
      alt: 'Shell Condo',
      logoSrc: 'shell-condo.png',
      description:
        'CondoShell is a comprehensive platform designed to streamline the management of condominium communities. It offers a range of features to facilitate communication, financial oversight, and maintenance scheduling.',
      image: 'work-006.png',
      title: 'Shell Condo',
      time: 'November 2024 - Present',
      skills: [
        { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', showMobileText: false },
        { icon: CapacitorJsSvg, title: 'Capacitor', to: 'https://capacitorjs.com/', showMobileText: false }
      ],
      type: 'Frontend Developer'
    }
  ]
}
export default db
