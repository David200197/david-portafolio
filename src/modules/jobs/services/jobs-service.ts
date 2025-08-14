import { Injectable } from "@/modules/core/decorators/Injectable";
import { Jobs } from "../entities/jobs";
import { LocalRepository } from "@/modules/core/services/local-respository";
import { GetJobsResponseDTO } from "../dtos/get-jobs-response-dto";

@Injectable()
export class JobsService {
  constructor(private readonly localRepository: LocalRepository) {}

  async getJobs(lang: string): Promise<Jobs> {
    const res = await this.localRepository.get<GetJobsResponseDTO>(
      lang,
      "jobs"
    );
    return new Jobs(res);
  }
}
