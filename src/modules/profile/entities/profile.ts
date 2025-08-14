import { GetProfileResponseDTO } from "../dtos/GetProfileResponseDTO";
import { PersonalDetail } from "../../core/models/PersonalDetail";

export class Profile {
  private readonly sectionTitle: string;
  private readonly skillTitle: string;
  private readonly description: string;
  private readonly links: PersonalDetail[];
  private readonly skills: PersonalDetail[];

  constructor(data: GetProfileResponseDTO) {
    const years = new Date().getFullYear() - 2021;
    this.description = data.description.replace("{years}", years.toString());
    this.links = data.links;
    this.skills = data.skills;
    this.sectionTitle = data.sectionTitle;
    this.skillTitle = data.skillTitle;
  }

  getDescription() {
    return this.description;
  }

  getLinks() {
    return this.links;
  }

  getSkills() {
    return this.skills;
  }

  getSection() {
    return this.sectionTitle;
  }

  getSkillTitle() {
    return this.skillTitle;
  }
}
