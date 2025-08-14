import { ContainerModule } from "inversify";
import { PortfolioService } from "../services/portfolio-service";

export const PortfolioModule = new ContainerModule((bind) => {
  bind(PortfolioService).toSelf().inSingletonScope();
});
