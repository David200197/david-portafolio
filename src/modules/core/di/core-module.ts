import { HttpClientAxios } from "../services/http-client-axios";
import { HttpClient } from "../models/HttpClient";
import { ErrorBoundaryInterceptor } from "../interceptors/error-boundary.interceptor";
import { ContainerModule } from "inversify";
import { CORE_DI } from "./constants";
import { ConfigService } from "../services/config-service";
import { ZodValidator } from "../services/zod-validator";
import { HttpResponseInterceptor } from "../interceptors/http-response.interceptor";
import { HttpErrorInterceptor } from "../interceptors/http-error.interceptor";
import { LocalRepository } from "../services/local-respository";

export const CoreModule = new ContainerModule((bind) => {
  bind<HttpClient>(CORE_DI.HTTP_CLIENT).to(HttpClientAxios).inSingletonScope();
  bind(CORE_DI.CONFIG_SERVICE).to(ConfigService).inSingletonScope();
  bind(ErrorBoundaryInterceptor).toSelf();
  bind(ZodValidator).toSelf();
  bind(HttpResponseInterceptor).toSelf();
  bind(HttpErrorInterceptor).toSelf();
  bind(LocalRepository).toSelf();
});
