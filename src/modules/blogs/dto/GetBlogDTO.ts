import { ItemSideMenu } from '../model/ItemSideMenu'

export interface BlogDataDTO {
  title: string
  createAt: string
  updateAt?: string
  author: string
  authorPhoto: string
  authorPhotoAlt: string
  tags?: string[]
  group?: string[]
  description: string
  image: string
  navigation?: string
}

export interface GetBlogDTO extends BlogDataDTO {
  content: string
  contentHtml: string
  slug: string
  lang: string
  navigationMenu: ItemSideMenu[]
}
