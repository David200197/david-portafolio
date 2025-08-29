import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Avatar } from '../ui/avatar'
import { Separator } from '../ui/separator'

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
  <article className="pt-[120px] pb-[30px] px-5 md:px-0">
    <div
      className="prose prose-lg mx-auto"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
    <Separator className="mt-5" />
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="flex">
        <Avatar>
          <AvatarImage src={authorPhoto} />
          <AvatarFallback>{authorPhotoAlt}</AvatarFallback>
        </Avatar>
        <p className="text-md mt-1 ml-1">{author}</p>
      </div>
      <p className="text-md mt-1 ml-3">2023-07-01</p>
    </div>
  </article>
)
