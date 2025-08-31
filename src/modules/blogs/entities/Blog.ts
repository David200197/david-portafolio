import dayjs from 'dayjs'
import { GetBlogDTO } from '../dto/GetBlogDTO'

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
    }
  }

  get link() {
    return `/${this.lang}/blogs/${this.slug}`
  }

  get createAtWithFormat() {
    return dayjs(this.createAt).locale(this.lang).format('D MMMM, YYYY')
  }

  get updateAtWithFormat() {
    return dayjs(this.updateAt).locale(this.lang).format('D MMMM, YYYY')
  }
}
