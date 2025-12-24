import { format } from 'date-fns'
import { GetBlogDTO } from '../dto/GetBlogDTO'
import { ItemSideMenu } from '../model/ItemSideMenu'

export class Blog {
  readonly content: string
  readonly contentHtml: string
  readonly title: string
  readonly createAt: string
  readonly updateAt: string
  readonly author: string
  readonly authorPhoto: string
  readonly authorPhotoAlt: string
  private readonly _tags: string[]
  private readonly _group: string[]
  readonly description: string
  readonly image: string
  readonly slug: string
  readonly lang: string
  readonly navigation?: string
  readonly navigationMenu: ItemSideMenu[]

  constructor(data: GetBlogDTO) {
    this.author = data.author
    this.authorPhoto = data.authorPhoto
    this.authorPhotoAlt = data.authorPhotoAlt
    this.content = data.content
    this.contentHtml = data.contentHtml
    this.createAt = data.createAt
    this.updateAt = data.updateAt || data.createAt
    this.description = data.description
    this.title = data.title
    this._tags = data.tags?.length ? [...data.tags] : []
    this._group = data.group?.length ? [...data.group] : []
    this.image = data.image
    this.slug = data.slug
    this.lang = data.lang
    this.navigation = data.navigation
    this.navigationMenu = data.navigationMenu || []
  }

  get tags() {
    return [...this._tags]
  }

  get group() {
    return [...this._group]
  }

  isUpdateAt() {
    return this.createAt !== this.updateAt
  }

  getDTO(): GetBlogDTO {
    return {
      author: this.author,
      authorPhoto: this.authorPhoto,
      authorPhotoAlt: this.authorPhotoAlt,
      content: this.content,
      contentHtml: this.contentHtml,
      createAt: this.createAt,
      description: this.description,
      image: this.image,
      slug: this.slug,
      title: this.title,
      group: this.group,
      tags: this.tags,
      updateAt: this.updateAt,
      lang: this.lang,
      navigation: this.navigation,
      navigationMenu: this.navigationMenu,
    }
  }

  get link() {
    return `/${this.lang}/blogs/${this.slug}`
  }

  get createAtWithFormat() {
    return format(this.createAt, 'dd/MM/yyyy')
  }

  get updateAtWithFormat() {
    return format(this.updateAt, 'dd/MM/yyyy')
  }

  get createAtDate() {
    return new Date(this.createAt)
  }

  get updateAtDate() {
    return new Date(this.updateAt)
  }

  get isNavigation() {
    return Boolean(this.navigationMenu.length)
  }
}
