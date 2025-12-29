import { getBlogService } from '@/modules/core/utils/di-utils'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/modules/blogs/components/AppSidebar'
import { SidebarProvider } from '@/modules/blogs/context/sidebar-context'
import { TriggerSidebarButton } from '@/modules/blogs/components/TriggerSidebarButton'
import { getDomain } from '@/modules/core/utils/get-domain'
import dynamic from 'next/dynamic'

const Article = dynamic(
  () => import('@/modules/blogs/components/Article').then((mod) => mod.Article),
  {
    loading: () => (
      <div className="animate-pulse p-8">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    ),
  }
)

const blogService = getBlogService()

export async function generateStaticParams() {
  const slugs = await blogService.getAllSlugNames()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const blog = await blogService.getBlog(lang, slug)
  if (!blog) return redirect('/not_found')

  const baseUrl = getDomain()
  const articleUrl = `${baseUrl}/${lang}/blog/${slug}`
  const imageUrl = blog.image.startsWith('http')
    ? blog.image
    : `${baseUrl}${blog.image}`

  return {
    title: blog.title,
    description: blog.description,
    authors: [{ name: blog.author }],
    keywords: blog.tags?.join(', '),

    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      url: articleUrl,
      siteName: 'David Alfonso - Blogs',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      publishedTime: blog.createAt,
      modifiedTime: blog.updateAt,
      authors: [blog.author],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: [imageUrl],
    },
  }
}

type Props = { params: Promise<{ lang: string; slug: string }> }
const Page = async ({ params }: Props) => {
  const { lang, slug } = await params
  const blog = await blogService.getBlog(lang, slug)
  const { nextBlog, prevBlog } = await blogService.getPrevAndNextBlogs(
    lang,
    slug
  )

  const blogSection = await blogService.getBlogSection(lang)

  if (!blog) return redirect('/not_found')

  return (
    <SidebarProvider>
      <AppSidebar
        items={blog.navigationMenu}
        titleSideMenu={blogSection.titleSideMenu}
      />
      {blog.isNavigation && <TriggerSidebarButton />}
      <Article blog={blog} nextBlog={nextBlog} prevBlog={prevBlog} />
    </SidebarProvider>
  )
}
export default Page
