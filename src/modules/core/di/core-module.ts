import { ErrorBoundaryInterceptor } from '../interceptors/error-boundary.interceptor'
import { ContainerModule } from 'inversify'
import { CORE_DI } from './constants'
import { ConfigService } from '../services/config-service'
import { ZodValidator } from '../services/zod-validator'
import { HttpResponseInterceptor } from '../interceptors/http-response.interceptor'
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor'
import { LocalRepository } from '../services/local-respository'
import { UnifiedMdRender } from '../services/unified-md-render'
import { MdRender } from '../models/MdRender'

export const CoreModule = new ContainerModule((bind) => {
  bind(CORE_DI.CONFIG_SERVICE).to(ConfigService).inSingletonScope()
  bind<MdRender>(CORE_DI.MD_RENDER).to(UnifiedMdRender)
  bind(ErrorBoundaryInterceptor).toSelf()
  bind(ZodValidator).toSelf()
  bind(HttpResponseInterceptor).toSelf()
  bind(HttpErrorInterceptor).toSelf()
  bind(LocalRepository).toSelf()
})
