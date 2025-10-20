import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { MdRender } from '../models/MdRender'
import rehypeRaw from 'rehype-raw'

export class UnifiedMdRender implements MdRender {
  async tranformToHTML<Data = Record<string, string>>(fileContents: string) {
    let mutateContent = fileContents

    const { data, content } = matter(mutateContent)
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content)
    const contentHtml = processedContent.toString()
    return { data: data as Data, content, contentHtml }
  }
}
