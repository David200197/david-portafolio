import { Icon, IconMui } from './icon'

export type Profile = {
  avatar: string
  description: string
}

export type Social = {
  title: string
  to: string
  icon: IconMui
}

export type Skill = {
  title: string
  to: string
  icon: Icon
  showMobileText?: boolean
  leftTooltip?: string
}

export type Job = {
  title: string
  alt: string
  image: string
  description: string
  time: string
  skills: Skill[]
  link?: string
  logoSrc: string
  type: 'Frontend Developer' | 'Backend Developer' | 'Fullstack Developer'
}

export type Db = {
  profile: Profile
  socials: Social[]
  skills: Skill[]
  jobs: Job[]
}
