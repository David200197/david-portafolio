import { BlogService } from '@/modules/blogs/services/blog-service'
import { Article } from '@/modules/blogs/components/Article'
import { getService } from '@/modules/core/utils/di-utils'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/modules/blogs/components/AppSidebar'
import { SidebarProvider } from '@/modules/blogs/context/sidebar-context'
import { TriggerSidebarButton } from '@/modules/blogs/components/TriggerSidebarButton'

const blogService = getService(BlogService)

export async function generateStaticParams() {
  const slugs = await blogService.getAllSlugNames()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const blog = await blogService.getBlog(lang, slug)
  if (!blog) return redirect('/not_found')

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
