'use client'

import { PageContainer } from '@/modules/portfolio/components/PageContainer'
import { SearchInput } from '../components/SearchInput'
import { BlogCard } from '../components/BlogCard'
import { useSeachBlog } from '../context/blogs-context'
import { motion, AnimatePresence } from 'motion/react'

export const SearchBlog = () => {
  const { blogs, search } = useSeachBlog()

  return (
    <PageContainer>
      <div className="px-5 md:px-30 pt-[150px] pb-[100px]">
        <SearchInput search={search} className="mx-auto" />

        <div className="grid h-auto grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          <AnimatePresence mode="popLayout">
            {blogs.getDatas().map((blog) => (
              <motion.div
                key={blog.slug}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  )
}
