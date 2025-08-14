import { ContainerModule } from "inversify";
import { BlogService } from "../services/blog-service";

export const BlogModule = new ContainerModule((bind) => {
  bind(BlogService).toSelf()
});
