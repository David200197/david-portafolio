import { ReactNode } from "react";
import moduleCss from "./BlogContainer.module.css";
import FinalCurve from "@/modules/core/assets/banners/finalCurve.svg";

type Props = { children: ReactNode };
export const BlogContainer = ({ children }: Props) => (
  <>
    <FinalCurve className={moduleCss.final_curve} />
    <div className={moduleCss.blog_container_body}>{children}</div>
  </>
);
