import { ContainerModule } from "inversify";
import { JobsService } from "../services/jobs-service";

export const JobsModule = new ContainerModule((bind) => {
  bind(JobsService).toSelf()
});
