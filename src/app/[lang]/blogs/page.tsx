import { BlogsProvider } from '@/modules/blogs/context/blogs-context'
import { BlogService } from '@/modules/blogs/services/blog-service'
import { getService } from '@/modules/core/utils/di-utils'

import dynamic from 'next/dynamic'

const SearchBlog = dynamic(
  () => import('@/modules/blogs/view/SearchBlog').then((mod) => mod.SearchBlog),
  {
    loading: () => (
      <div className="px-5 md:px-30 pt-[150px] pb-[100px]">
        <div className="h-10 w-full max-w-md mx-auto bg-gray-100 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    ),
  }
)

const blogService = getService(BlogService)

type Props = { params: Promise<{ lang: string }> }

const Page = async ({ params }: Props) => {
  const { lang } = await params
  const blogs = await blogService.getBlogs(lang)

  return (
    <BlogsProvider blogsDTO={blogs.getDTO()}>
      <SearchBlog />
    </BlogsProvider>
  )
}
export default Page
