import { BlogService } from '@/modules/blogs/services/blog-service'
import { Article } from '@/modules/core/components/Article'
import { Avatar } from '@/modules/core/ui/avatar'
import { getService } from '@/modules/core/utils/di-utils'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Metadata } from 'next'

const blogService = getService(BlogService)

export async function generateStaticParams() {
  const slugs = await blogService.getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const blog = await blogService.getBlog(lang, slug)

  return {
    title: blog.title,
    description: blog.description,
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: blog.createAt,
      authors: [blog.author],
      images: [blog.image],
    },
    keywords: blog.tags?.join(', '),
  }
}

type Props = { params: Promise<{ lang: string; slug: string }> }
const Page = async ({ params }: Props) => {
  const { lang, slug } = await params
  const blog = await blogService.getBlog(lang, slug)
  return (
    <Article
      contentHtml={blog.contentHtml}
      author={blog.author}
      authorPhoto={blog.authorPhoto}
      authorPhotoAlt={blog.authorPhotoAlt}
    />
  )
}
export default Page
