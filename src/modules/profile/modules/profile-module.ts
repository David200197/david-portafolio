import { ContainerModule } from "inversify";
import { ProfileService } from "../services/profile-service";

export const ProfileModule = new ContainerModule((bind) => {
  bind(ProfileService).toSelf()
});
