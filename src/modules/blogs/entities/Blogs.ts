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
    const result = this.fuse.search(query)
    return new Blogs(result.map((res) => res.item))
  }
}
