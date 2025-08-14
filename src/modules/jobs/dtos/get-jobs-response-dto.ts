import { JobDTO } from "./job-dto";

export type GetJobsResponseDTO = {
  sectionTitle: string;
  jobs: JobDTO[];
};
