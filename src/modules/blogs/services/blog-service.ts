import { Injectable } from '@/modules/core/decorators/Injectable'
import { BlogSection } from '../model/BlogSection'
import { LocalRepository } from '@/modules/core/services/local-respository'
import fs from 'fs/promises'
import path from 'path'
import { InjectMdRender } from '@/modules/core/decorators/InjectMdRender'
import type { MdRender } from '@/modules/core/models/MdRender'
import { Blog } from '../entities/Blog'
import { BlogDataDTO } from '../dto/GetBlogDTO'
import { InjectBlogValidator } from '../decorator/InjectBlogValidator'
import type { BlogValidator } from '../model/BlogValidator'
import { Blogs } from '../entities/Blogs'

@Injectable()
export class BlogService {
  BLOGS_CONTENT_PATH: string

  constructor(
    private readonly localRepository: LocalRepository,
    @InjectMdRender() private readonly mdRender: MdRender,
    @InjectBlogValidator() private readonly blogValidator: BlogValidator
  ) {
    this.BLOGS_CONTENT_PATH = path.join(
      process.cwd(),
      'src',
      'contents',
      'blogs'
    )
  }

  async getBlogSection(lang: string): Promise<BlogSection> {
    return await this.localRepository.get<BlogSection>(lang, 'blog-section')
  }

  async getAllSlugs() {
    const blogFiles = await fs.readdir(this.BLOGS_CONTENT_PATH, {
      recursive: true,
    })
    const slugNames = blogFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.basename(file).split('.')[0])
    return Array.from(new Set(slugNames))
  }

  async getBlog(lang: string, slug: string) {
    const filePath = path.join(this.BLOGS_CONTENT_PATH, `${slug}.${lang}.md`)
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { content, contentHtml, data } =
      await this.mdRender.tranformToHTML<BlogDataDTO>(fileContents)

    const dataValidated = this.blogValidator.validateDataBlogDto(data)

    return new Blog(
      this.blogValidator.validateGetBlogDTO({
        ...dataValidated,
        content,
        contentHtml,
        slug,
      })
    )
  }

  async getBlogs(lang: string) {
    const slugs = await this.getAllSlugs()

    const blogs = await Promise.all(
      slugs.map((slug) => this.getBlog(lang, slug))
    )

    return new Blogs(blogs)
  }
}
