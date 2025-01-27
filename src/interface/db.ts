import { FC } from 'react'
import { Icon, IconMui } from './icon'

export type Profile = {
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

export type Navigation = {
  mark: string
  to?: string
  section: FC<NavigationProps>
  label: string
  offset?: number
  disabled?: boolean
}

export type NavigationProps = { navigation: Navigation }

export type Db = {
  navigations: Navigation[]
  profile: Profile
  socials: Social[]
  skills: Skill[]
  jobs: Job[]
}
