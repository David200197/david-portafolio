type Props = { contentHtml: string }
export const Article = ({ contentHtml }: Props) => (
  <article className="prose prose-lg py-[120px] mx-auto px-5 md:px-0">
    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
  </article>
)
