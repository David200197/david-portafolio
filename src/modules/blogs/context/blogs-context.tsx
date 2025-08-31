'use client'

import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { Blogs } from '../entities/Blogs'
import { GetBlogDTO } from '../dto/GetBlogDTO'

interface BlogsContextModel {
  blogs: Blogs
  search: (query: string) => void
}

const BlogsContext = createContext<BlogsContextModel | null>(null)

type Props = { blogsDTO: GetBlogDTO[]; children: ReactNode }

export const BlogsProvider = ({ blogsDTO, children }: Props) => {
  const blogs = useRef(new Blogs(blogsDTO)).current
  const [currentBlogs, setCurrentBlogs] = useState(blogs)
  const search = (query: string) => {
    setCurrentBlogs(blogs.search(query))
  }

  return (
    <BlogsContext.Provider value={{ blogs: currentBlogs, search }}>
      {children}
    </BlogsContext.Provider>
  )
}

export const useSeachBlog = () => {
  const ctx = useContext(BlogsContext)
  if (!ctx) throw new Error('BlogsProvider is Missing')
  return ctx
}
