import { Button } from '@/modules/core/ui/button'
import { BlogContainer } from '../components/BlogContainer'
import { BlogSection } from '../model/BlogSection'
import { getImagePath } from '@/modules/core/utils/get-img-path'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  blogSection: BlogSection
}

export const BlogRedirect = ({ blogSection }: Props) => {
  return (
    <BlogContainer>
      <h1 className="text-white text-center text-2xl mb-6">
        {blogSection.sectionTitle}
      </h1>
      <Image
        src={getImagePath('/astronaut_blog.svg')}
        alt="astronaut_blog"
        className="w-[150px] md:w-[200px]"
        width={200}
        height={200}
        loading="lazy"
      />
      <p className="text-white text-center mt-5">{blogSection.description}</p>
      <Button
        asChild
        className="mt-5"
        variant={'outline'}
        aria-label={blogSection.sectionTitle}
      >
        <Link href={blogSection.link} aria-label={blogSection.linkText}>
          {blogSection.linkText}
        </Link>
      </Button>
    </BlogContainer>
  )
}
