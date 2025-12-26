import container, { Cradle } from '../di/container'

export const getDi = () => container

/**
 * Get a service from the DI container
 * @param serviceName - The name of the service to resolve (camelCase)
 *
 * @example
 * // Before (Inversify):
 * const blogService = getService(BlogService)
 *
 * // After (Awilix):
 * const blogService = getService('blogService')
 */
export function getService<K extends keyof Cradle>(serviceName: K): Cradle[K] {
  return container.resolve(serviceName)
}

// Convenience exports for common services
export const getBlogService = () => getService('blogService')
export const getPortfolioService = () => getService('portfolioService')
export const getProfileService = () => getService('profileService')
export const getJobsService = () => getService('jobsService')
