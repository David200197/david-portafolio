import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/core/ui/card'
import { Blog } from '../entities/Blog'
import Link from 'next/link'

type Props = { blog: Blog }

export const BlogCard = ({ blog }: Props) => (
  <Link href={blog.link}>
    <Card className="shadow-sm hover:shadow-xl transition duration-600 ease-in-out h-full">
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
        <CardDescription>{blog.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <img src={blog.image} alt={'blog image'} />
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex flex-col">
          <div className="text-lg font-medium text-gray-900">{blog.author}</div>
          <div className="flex items-center text-gray-500 text-sm">
            {blog.updateAtWithFormat}
          </div>
        </div>
      </CardFooter>
    </Card>
  </Link>
)
