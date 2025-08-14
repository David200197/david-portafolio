import { PersonalDetail } from "../../core/models/PersonalDetail";

export interface GetProfileResponseDTO {
  sectionTitle: string;
  skillTitle: string;
  description: string;
  links: PersonalDetail[];
  skills: PersonalDetail[];
}
