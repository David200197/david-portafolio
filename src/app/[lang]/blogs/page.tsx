import { BlogService } from '@/modules/blogs/services/blog-service'
import { SearchBlog } from '@/modules/blogs/view/SearchBlog'
import { getService } from '@/modules/core/utils/di-utils'

const blogService = getService(BlogService)

type Props = { params: Promise<{ lang: string }> }

const Page = async ({ params }: Props) => {
  const { lang } = await params
  const blogs = await blogService.getBlogs(lang)

  return <SearchBlog blogsDTO={blogs.getDTO()} />
}
export default Page
