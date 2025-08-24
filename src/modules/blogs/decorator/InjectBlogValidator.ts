import { Inject } from '@/modules/core/decorators/Inject'
import { BLOG_DI } from '../constants/blog-di'

export const InjectBlogValidator = () => Inject(BLOG_DI.VALIDATOR)
