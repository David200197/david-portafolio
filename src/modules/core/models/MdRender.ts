export interface MdRender {
  tranformToHTML<Data = Record<string, string>>(
    fileContents: string
  ): Promise<{
    data: Data
    content: string
    contentHtml: string
  }>
}
