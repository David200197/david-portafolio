import { BlogService } from '@/modules/blogs/services/blog-service'
import { Article } from '@/modules/core/components/Article'
import { getService } from '@/modules/core/utils/di-utils'

const blogService = getService(BlogService)

export async function generateStaticParams() {
  const slugs = await blogService.getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

type Props = { params: Promise<{ lang: string; slug: string }> }
const Page = async ({ params }: Props) => {
  const { lang, slug } = await params
  const blog = await blogService.getBlog(lang, slug)
  return <Article contentHtml={blog.contentHtml} />
}
export default Page
