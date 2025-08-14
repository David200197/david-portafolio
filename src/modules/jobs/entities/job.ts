import { PersonalDetail } from "@/modules/core/models/PersonalDetail";
import { JobDTO } from "../dtos/job-dto";

export class Job {
  readonly alt: string;
  readonly logoSrc: string;
  readonly description: string;
  readonly time: string;
  readonly image: string;
  readonly title: string;
  private _skills: PersonalDetail[];
  readonly type: string;
  readonly link?: string;

  get skills() {
    return this._skills;
  }

  constructor(data: JobDTO) {
    this.alt = data.alt;
    this.logoSrc = data.logoSrc;
    this.description = data.description;
    this.time = data.time;
    this.image = data.image;
    this.title = data.title;
    this._skills = data.skills;
    this.type = data.type;
    this.link = data.link;
  }

  isPublic() {
    return Boolean(this.link);
  }

  isPrivate() {
    return !this.isPublic();
  }
}
