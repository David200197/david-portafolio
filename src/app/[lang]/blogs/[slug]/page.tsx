import { BlogService } from '@/modules/blogs/services/blog-service'
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
  return (
    <article className="prose prose-lg py-[120px] mx-auto px-5 md:px-0">
      <div dangerouslySetInnerHTML={{ __html: blog.contentHtml }} />
    </article>
  )
}
export default Page
