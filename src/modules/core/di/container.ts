import "reflect-metadata";
import { Container } from "inversify";

import { CoreModule } from "./core-module";
import { PortfolioModule } from "@/modules/portfolio/modules/portfolio-module";
import { ProfileModule } from "@/modules/profile/modules/profile-module";
import { JobsModule } from "@/modules/jobs/modules/jobs-module";
import { BlogModule } from "@/modules/blogs/modules/blog-module";

const container = new Container();
container.load(
  CoreModule,
  PortfolioModule,
  ProfileModule,
  JobsModule,
  BlogModule
);
export default container;
