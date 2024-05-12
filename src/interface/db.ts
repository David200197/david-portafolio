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
}
export type Job = {}

export type Db = {
  profile: Profile
  socials: Social[]
  skills: Skill[]
  jobs: Job[]
}
