import { Avatar, AvatarFallback, AvatarImage } from '../../core/ui/avatar'
import { Blog } from '@/modules/blogs/entities/Blog'
import { Button } from '@/modules/core/ui/button'
import Link from 'next/link'

type Props = {
  blog: Blog
  prevBlog: Blog | null
  nextBlog: Blog | null
}
export const Article = ({ blog, nextBlog, prevBlog }: Props) => (
  <article className="pt-[120px] pb-[30px] px-5 md:px-0 w-[inherit]">
    <div
      className="prose prose-lg mx-auto"
      dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
    />
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="flex">
        <Avatar>
          <AvatarImage src={blog.authorPhoto} />
          <AvatarFallback>{blog.authorPhotoAlt}</AvatarFallback>
        </Avatar>
        <p className="text-md mt-1 ml-1">{blog.author}</p>
      </div>
      <p className="text-md mt-1 ml-3">{blog.updateAtWithFormat}</p>
    </div>
    <div className="grid md:grid-cols-2 mt-4">
      <div className="flex justify-center">
        {prevBlog && <NavigateBlogButton blog={prevBlog} />}
      </div>
      <div className="flex justify-center mt-3 md:mt-0">
        {nextBlog && <NavigateBlogButton blog={nextBlog} isNext />}
      </div>
    </div>
  </article>
)

type NavigateBlogButtonProps = {
  blog: Blog
  isNext?: boolean
}
const NavigateBlogButton = ({
  blog,
  isNext = false,
}: NavigateBlogButtonProps) => (
  <Link href={blog.link}>
    <Button
      variant="secondary"
      className="flex h-[100px] w-[300px] items-center cursor-pointer"
    >
      {isNext ? (
        <>
          <p className="text-wrap">{blog.title}</p>
          <p>{'>'}</p>
        </>
      ) : (
        <>
          <p>{'<'}</p>
          <p className="text-wrap">{blog.title}</p>
        </>
      )}
    </Button>
  </Link>
)
