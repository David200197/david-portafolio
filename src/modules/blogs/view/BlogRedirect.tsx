import { Button } from "@/modules/core/ui/button";
import { BlogContainer } from "../components/BlogContainer";
import Link from "next/link";
import { BlogSection } from "../model/BlogSection";

type Props = {
  blogSection: BlogSection;
};

export const BlogRedirect = ({ blogSection }: Props) => {
  return (
    <BlogContainer>
      <h1 className="text-white text-center text-2xl mb-6">
        {blogSection.sectionTitle}
      </h1>
      <img
        src="/astronaut_blog.svg"
        alt="astronaut_blog"
        className="w-[150px] md:w-[200px]"
      />
      <p className="text-white text-center mt-5">{blogSection.description}</p>
      <Button asChild className="mt-5" variant={"outline"}>
        <Link href={blogSection.link}>SEE MY BLOGS</Link>
      </Button>
    </BlogContainer>
  );
};
