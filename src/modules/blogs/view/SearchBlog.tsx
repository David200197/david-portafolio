'use client'

import { PageContainer } from '@/modules/portfolio/components/PageContainer'
import { SearchInput } from '../components/SearchInput'
import { Blogs } from '../entities/Blogs'
import { useRef, useState } from 'react'
import { GetBlogDTO } from '../dto/GetBlogDTO'

type Props = { blogsDTO: GetBlogDTO[] }

export const SearchBlog = ({ blogsDTO }: Props) => {
  const blogs = useRef(new Blogs(blogsDTO)).current
  const [currentBlogs, setCurrentBlogs] = useState(blogs)
  const search = (query: string) => {
    setCurrentBlogs(blogs.search(query))
  }

  console.log({ length: currentBlogs.getDTO().length })

  return (
    <PageContainer>
      <div className="pt-[150px] px-5 w-full flex flex-column">
        <SearchInput search={search} className="mx-auto" />
      </div>
    </PageContainer>
  )
}
