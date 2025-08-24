import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Avatar } from '../ui/avatar'

type Props = {
  contentHtml: string
  author: string
  authorPhoto: string
  authorPhotoAlt: string
}
export const Article = ({
  contentHtml,
  author,
  authorPhoto,
  authorPhotoAlt,
}: Props) => (
  <article className="py-[120px] px-5 md:px-0">
    <div className="flex items-center justify-center mb-3">
      <div className="flex">
        <Avatar>
          <AvatarImage src={authorPhoto} />
          <AvatarFallback>{authorPhotoAlt}</AvatarFallback>
        </Avatar>
        <p className="text-md mt-1 ml-1">{author}</p>
        <p className="text-md mt-1 ml-3">2023-07-01</p>
      </div>
    </div>
    <div
      className="prose prose-lg mx-auto"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  </article>
)
