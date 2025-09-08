import { Injectable } from '@/modules/core/decorators/Injectable'
import { BlogSection } from '../model/BlogSection'
import { LocalRepository } from '@/modules/core/services/local-respository'
import { InjectMdRender } from '@/modules/core/decorators/InjectMdRender'
import type { MdRender } from '@/modules/core/models/MdRender'
import { Blog } from '../entities/Blog'
import { BlogDataDTO } from '../dto/GetBlogDTO'
import { InjectBlogValidator } from '../decorator/InjectBlogValidator'
import type { BlogValidator } from '../model/BlogValidator'
import { Blogs } from '../entities/Blogs'
import { CacheManager } from '@/modules/core/services/cache-manager'
import { getPath } from '@/modules/core/utils/fallbacks/get-path'
import { getFs } from '@/modules/core/utils/fallbacks/get-fs'

@Injectable()
export class BlogService {
  constructor(
    private readonly localRepository: LocalRepository,
    @InjectMdRender() private readonly mdRender: MdRender,
    @InjectBlogValidator() private readonly blogValidator: BlogValidator,
    private readonly cacheManager: CacheManager
  ) {}

  private getBlogContentPath = async () => {
    const path = await getPath()
    return path.join(process.cwd(), 'src', 'contents', 'blogs')
  }

  async getBlogSection(lang: string): Promise<BlogSection> {
    return await this.localRepository.get<BlogSection>(lang, 'blog-section')
  }

  async getAllSlugs() {
    const fs = await getFs()
    const path = await getPath()

    const blogContentPath = await this.getBlogContentPath()
    const blogFiles = await fs.readdir(blogContentPath, {
      recursive: true,
    })
    const slugNames = blogFiles
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.basename(file).split('.')[0])
    return Array.from(new Set(slugNames))
  }

  private async createBlog(lang: string, slug: string) {
    const fs = await getFs()
    const path = await getPath()
    const blogContentPath = await this.getBlogContentPath()
    const filePath = path.join(blogContentPath, `${slug}.${lang}.md`)
    const fileContents = await fs.readFile(filePath, 'utf8')
    const { content, contentHtml, data } =
      await this.mdRender.tranformToHTML<BlogDataDTO>(fileContents)

    const dataValidated = this.blogValidator.validateDataBlogDto(data)
    const blogValidated = this.blogValidator.validateGetBlogDTO({
      ...dataValidated,
      content,
      contentHtml,
      slug,
      lang,
    })

    return new Blog(blogValidated)
  }

  async getBlog(lang: string, slug: string) {
    const blogs = await this.getBlogs(lang)
    return blogs.get(slug)
  }

  async getBlogs(lang: string) {
    const key = `blogs_${lang}`
    const storeBlogs = this.cacheManager.get<Blogs>(key)
    if (storeBlogs) return storeBlogs
    const slugs = await this.getAllSlugs()
    const createdBlogs = await Promise.all(
      slugs.map((slug) => this.createBlog(lang, slug))
    )
    const blogs = new Blogs(createdBlogs)
    this.cacheManager.set(key, blogs)
    return blogs
  }

  async getPrevAndNextBlogs(lang: string, slug: string) {
    const blogs = (await this.getBlogs(lang)).sortByUpdateAt('asc')
    const nextBlog = blogs.getNext(slug)
    const prevBlog = blogs.getPrev(slug)

    return {
      nextBlog,
      prevBlog,
    }
  }
}
