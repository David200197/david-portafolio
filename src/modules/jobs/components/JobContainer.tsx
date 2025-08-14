import { ReactNode } from "react";
import moduleCss from "./JobContainer.module.css";
import { cn } from "@/modules/core/lib/utils";

type Props = { children: ReactNode; id?: string };
export const JobContainer = ({ children, id }: Props) => (
  <section className={cn(moduleCss.job_container_body)} id={id} >{children}</section>
);
