import { GetJobsResponseDTO } from "../dtos/get-jobs-response-dto";
import { Job } from "./job";

export class Jobs {
  private readonly sectionTitle: string;
  private readonly jobs: Job[];

  constructor(data: GetJobsResponseDTO) {
    this.jobs = data.jobs.map((item) => new Job(item));
    this.sectionTitle = data.sectionTitle;
  }

  getJobs() {
    return this.jobs;
  }

  getSectionTitle() {
    return this.sectionTitle;
  }
}
