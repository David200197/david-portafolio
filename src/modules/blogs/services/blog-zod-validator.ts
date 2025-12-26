import { ZodValidator } from '@/modules/core/services/zod-validator'
import { BlogDataDTO, GetBlogDTO } from '../dto/GetBlogDTO'
import { z } from 'zod'
import { BlogValidator } from '../model/BlogValidator'

const BlogDataSchema = z.object({
  title: z.string(),
  createAt: z.string().datetime().or(z.string()),
  updateAt: z.string().datetime().optional().or(z.string().optional()),
  author: z.string(),
  authorPhoto: z.string().url().or(z.string()),
  authorPhotoAlt: z.string(),
  tags: z.array(z.string()).optional(),
  group: z.array(z.string()).optional(),
  description: z.string(),
  image: z.string().url().or(z.string()),
  navigation: z.string().optional(),
})

export const SimpleItemSideMenuSchema = z.object({
  title: z.string(),
  url: z.string(),
})

export const SubmenuItemSideMenuSchema = z.object({
  title: z.string(),
  submenu: z.array(SimpleItemSideMenuSchema),
})

export const ItemSideMenuSchema = z.union([
  SimpleItemSideMenuSchema,
  SubmenuItemSideMenuSchema,
])

const GetBlogSchema = BlogDataSchema.extend({
  content: z.string(),
  contentHtml: z.string(),
  slug: z.string(),
  lang: z.string(),
  navigationMenu: z.array(ItemSideMenuSchema).optional(),
})

const GetBlogsSchema = z.array(GetBlogSchema)

export class BlogZodValidator implements BlogValidator {
  constructor(private readonly zodValidator: ZodValidator) {}

  validateDataBlogDto(data: BlogDataDTO) {
    return this.zodValidator.validate('BlogDataDTO', BlogDataSchema, data)
  }

  validateGetBlogDTO(data: GetBlogDTO) {
    return this.zodValidator.validate('GetBlogDTO', GetBlogSchema, data)
  }

  validateGetBlogsDTO(data: GetBlogDTO[]) {
    return this.zodValidator.validate('GetBlogsDTO', GetBlogsSchema, data)
  }
}
