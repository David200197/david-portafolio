import { GetBlogDTO } from '../dto/GetBlogDTO'
import { Blog } from './Blog'

export class Blogs {
  private readonly datas: Blog[]

  constructor(datas: GetBlogDTO[]) {
    this.datas = datas.map((data) => new Blog(data))
  }

  getDatas() {
    return this.datas
  }

  search(query: string) {
    //TODO
    return new Blogs([])
  }
}
