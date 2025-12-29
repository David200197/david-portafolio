import { MdRender } from '../models/MdRender'
import {
  getGrayMatter,
  getRehypeHighlight,
  getRehypeRaw,
  getRehypeStringify,
  getRemarkGfm,
  getRemarkParse,
  getRemarkRehype,
  getUnified,
} from '../utils/fallbacks/get-md-renders'

export class UnifiedMdRender implements MdRender {
  async tranformToHTML<Data = Record<string, string>>(fileContents: string) {
    const mutateContent = fileContents

    const matter = await getGrayMatter()
    const { unified } = await getUnified()
    const remarkParse = (await getRemarkParse()).default
    const remarkGfm = (await getRemarkGfm()).default
    const remarkRehype = (await getRemarkRehype()).default
    const rehypeRaw = (await getRehypeRaw()).default
    const rehypeHighlight = (await getRehypeHighlight()).default
    const rehypeStringify = (await getRehypeStringify()).default

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
