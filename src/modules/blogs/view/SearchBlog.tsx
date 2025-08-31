'use client'

import { PageContainer } from '@/modules/portfolio/components/PageContainer'
import { SearchInput } from '../components/SearchInput'
import { BlogCard } from '../components/BlogCard'
import { useSeachBlog } from '../context/blogs-context'

export const SearchBlog = () => {
  const { blogs, search } = useSeachBlog()

  return (
    <PageContainer>
      <div className="px-5 md:px-30 pt-[150px] pb-[100px]">
        <SearchInput search={search} className="mx-auto" />
        <div className="grid h-auto grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          {blogs.getDatas().map((blog) => (
            <BlogCard blog={blog} key={blog.slug} />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
