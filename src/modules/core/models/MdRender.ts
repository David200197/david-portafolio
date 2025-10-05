export interface MdRender {
  tranformToHTML<Data = Record<string, string>>(
    fileContents: string,
    extendContents: Record<string, string>
  ): Promise<{
    data: Data
    content: string
    contentHtml: string
  }>
}
