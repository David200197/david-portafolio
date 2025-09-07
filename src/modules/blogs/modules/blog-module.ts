import { ContainerModule } from 'inversify'
import { BlogService } from '../services/blog-service'
import { BLOG_DI } from '../constants/blog-di'
import { BlogZodValidator } from '../services/blog-zod-validator'
import { BlogValidator } from '../model/BlogValidator'

export const BlogModule = new ContainerModule((bind) => {
  bind(BlogService).toSelf()
  bind<BlogValidator>(BLOG_DI.VALIDATOR).to(BlogZodValidator)
})
