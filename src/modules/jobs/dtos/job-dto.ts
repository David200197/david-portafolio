import { PersonalDetail } from "@/modules/core/models/PersonalDetail";

export interface JobDTO {
  alt: string;
  logoSrc: string;
  description: string;
  time: string;
  image: string;
  title: string;
  skills: PersonalDetail[];
  type: string;
  link?: string;
}
