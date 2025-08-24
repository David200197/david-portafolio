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
  readonly prevSlug?: string
  readonly nextSlug?: string

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
    this.nextSlug = data.nextSlug
    this.prevSlug = data.prevSlug
  }

  get tags() {
    return [...this._tags]
  }

  get group() {
    return [...this._group]
  }

  isNextSlug() {
    return Boolean(this.nextSlug)
  }

  isPrevSlug() {
    return Boolean(this.prevSlug)
  }

  isUpdateAt() {
    return this.createAt !== this.updateAt
  }
}
