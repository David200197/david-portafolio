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
  TailwindSvg,
  TypescriptSvg
} from '@/components/svg'

import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Db } from '@/interface/db'
import { BANNER_MARK, BLOG_MARK, BLOG_PATH, MY_WORK_MARK, PERSONAL_INFO_MARK } from '@/constant'
import BigBanner from '@/components/customs/BigBanner'
import PersonalInfo from '@/components/customs/PersonalInfo'
import MyWorks from '@/components/customs/MyWorks'
import BlogBanner from '@/components/customs/BlogBanner'

const db: Db = {
  navigations: [
    {
      label: 'home',
      mark: BANNER_MARK,
      section: BigBanner
    },
    {
      label: 'about_me',
      mark: PERSONAL_INFO_MARK,
      section: PersonalInfo,
      offset: -120
    },
    {
      label: 'jobs',
      mark: MY_WORK_MARK,
      section: MyWorks,
      offset: 150
    },
    {
      label: 'blogs',
      mark: BLOG_MARK,
      section: BlogBanner,
      to: BLOG_PATH,
      disabled: true
    }
  ],
  profile: {
    description: 'profile_description'
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
    { icon: AdonisSvg, title: 'Adonis', to: 'https://adonisjs.com/', leftTooltip: '30px' },
    { icon: PlasmoSvg, title: 'Plasmo', to: 'https://docs.plasmo.com/', leftTooltip: '30px' },
    { icon: CapacitorJsSvg, title: 'Capacitor', to: 'https://capacitorjs.com/', leftTooltip: '30px' }
  ],
  jobs: [
    {
      alt: 'teigee',
      logoSrc: 'teigee.webp',
      description: 'teigee_description',
      time: 'teigee_time',
      image: 'work-001.png',
      title: 'Teigee',
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
      description: 'leiizy_description',
      time: 'leiizy_time',
      image: 'work-002.png',
      title: 'Leiizy',
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
      description: 'eneldo_description',
      time: 'eneldo_time',
      image: 'work-004.png',
      title: 'Eneldo Laboral',
      skills: [{ icon: NestSvg, title: 'Nest', to: 'https://nestjs.com/' }],
      type: 'Backend Developer'
    },
    {
      alt: 'construccions precises',
      logoSrc: 'construccions_precises.svg',
      description: 'construccions_precises_description',
      time: 'construccions_precises_time',
      image: 'work-005.png',
      title: 'Construccions Precises',
      skills: [{ icon: NestSvg, title: 'Nest', to: 'https://nestjs.com/' }],
      type: 'Backend Developer'
    },
    {
      alt: 'ibx',
      logoSrc: 'ibx.svg',
      description: 'ibx_description',
      time: 'ibx_time',
      image: 'work-003.png',
      title: 'Ibx',
      skills: [{ icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', showMobileText: false }],
      link: 'https://app.ibx.exchange/',
      type: 'Frontend Developer'
    },
    {
      alt: 'Shell Condo',
      logoSrc: 'shell-condo.png',
      description: 'shell_condo_description',
      time: 'shell_condo_time',
      image: 'work-006.png',
      title: 'Shell Condo',
      skills: [
        { icon: NextSvg, title: 'Next', to: 'https://nextjs.org/', showMobileText: false },
        { icon: CapacitorJsSvg, title: 'Capacitor', to: 'https://capacitorjs.com/', showMobileText: false }
      ],
      type: 'Frontend Developer'
    }
  ]
}
export default db
