import { BlogService } from '@/modules/blogs/services/blog-service'
import { getService } from '@/modules/core/utils/di-utils'

const blogService = getService(BlogService)

type Props = { params: Promise<{ lang: string }> }

const Page = async ({ params }: Props) => {
  const { lang } = await params
  const blogs = await blogService.getBlogs(lang)

  console.log(blogs)

  return <></>
}
export default Page
