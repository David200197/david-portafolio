import { GetBlogDTO } from '../dto/GetBlogDTO'
import { Blog } from './Blog'
import Fuse from 'fuse.js'

export class Blogs {
  private readonly datas: Blog[]
  private readonly fuse: Fuse<Blog>

  constructor(datas: GetBlogDTO[]) {
    this.datas = datas.map((data) => new Blog(data))
    this.fuse = new Fuse(this.datas, {
      keys: ['title', 'description', 'tags', 'group', 'content'],
    })
  }

  getDatas() {
    return this.datas
  }

  getDTO() {
    return this.datas.map((data) => data.getDTO())
  }

  search(query: string) {
    if (!query) return this
    const result = this.fuse.search(query)
    return new Blogs(result.map((res) => res.item))
  }

  get(slug: string) {
    return this.datas.find((data) => data.slug === slug) || null
  }

  getNext(slug: string) {
    const index = this.datas.findIndex((data) => data.slug === slug)
    if (index === -1 || index === this.datas.length) return null
    return this.datas[index + 1]
  }

  getPrev(slug: string) {
    const index = this.datas.findIndex((data) => data.slug === slug)
    if (index === -1 || index === 0) return null
    return this.datas[index - 1]
  }
}
