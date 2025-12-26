import { createContainer, asFunction } from 'awilix'

// Core Services
import { ConfigService } from '../services/config-service'
import { ZodValidator } from '../services/zod-validator'
import { LocalRepository } from '../services/local-respository'
import { UnifiedMdRender } from '../services/unified-md-render'
import { CacheManager } from '../services/cache-manager'
import { ErrorBoundaryInterceptor } from '../interceptors/error-boundary.interceptor'
import { HttpResponseInterceptor } from '../interceptors/http-response.interceptor'
import { HttpErrorInterceptor } from '../interceptors/http-error.interceptor'

// Module Services
import { PortfolioService } from '@/modules/portfolio/services/portfolio-service'
import { ProfileService } from '@/modules/profile/services/profile-service'
import { JobsService } from '@/modules/jobs/services/jobs-service'
import { BlogService } from '@/modules/blogs/services/blog-service'
import { BlogZodValidator } from '@/modules/blogs/services/blog-zod-validator'

// Types
import type { MdRender } from '../models/MdRender'
import type { BlogValidator } from '@/modules/blogs/model/BlogValidator'

const container = createContainer()

container.register({
  // ============ Core Services (sin dependencias) ============
  configService: asFunction(
    ({ zodValidator }) => new ConfigService(zodValidator)
  ).singleton(),
  cacheManager: asFunction(() => new CacheManager()).singleton(),
  zodValidator: asFunction(() => new ZodValidator()),
  localRepository: asFunction(() => new LocalRepository()),
  mdRender: asFunction(() => new UnifiedMdRender()),

  // Interceptors (sin dependencias)
  errorBoundaryInterceptor: asFunction(() => new ErrorBoundaryInterceptor()),
  httpResponseInterceptor: asFunction(() => new HttpResponseInterceptor()),
  httpErrorInterceptor: asFunction(() => new HttpErrorInterceptor()),

  // ============ Blog Module ============
  blogValidator: asFunction(
    ({ zodValidator }) => new BlogZodValidator(zodValidator)
  ),
  blogService: asFunction(
    ({ localRepository, mdRender, blogValidator, cacheManager }) =>
      new BlogService(localRepository, mdRender, blogValidator, cacheManager)
  ),

  // ============ Portfolio Module ============
  portfolioService: asFunction(
    ({ localRepository }) => new PortfolioService(localRepository)
  ).singleton(),

  // ============ Profile Module ============
  profileService: asFunction(
    ({ localRepository }) => new ProfileService(localRepository)
  ),

  // ============ Jobs Module ============
  jobsService: asFunction(
    ({ localRepository }) => new JobsService(localRepository)
  ),
})

// Type-safe container interface
export interface Cradle {
  // Core
  configService: ConfigService
  zodValidator: ZodValidator
  localRepository: LocalRepository
  mdRender: MdRender
  cacheManager: CacheManager
  errorBoundaryInterceptor: ErrorBoundaryInterceptor
  httpResponseInterceptor: HttpResponseInterceptor
  httpErrorInterceptor: HttpErrorInterceptor
  // Modules
  blogValidator: BlogValidator
  blogService: BlogService
  portfolioService: PortfolioService
  profileService: ProfileService
  jobsService: JobsService
}

export default container
