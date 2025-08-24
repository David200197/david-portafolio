import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { MdRender } from '../models/MdRender'

export class UnifiedMdRender implements MdRender {
  async tranformToHTML<Data = Record<string, string>>(fileContents: string) {
    const { data, content } = matter(fileContents)
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(content)
    const contentHtml = processedContent.toString()
    return { data: data as Data, content, contentHtml }
  }
}
