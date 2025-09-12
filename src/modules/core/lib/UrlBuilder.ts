/**
 * Utility class for building URLs with path segments and query parameters.
 *
 * @example
 * ```typescript
 * const url = new UrlBuilder('https://api.example.com', 'users', '123')
 *   .addQuery('active', true)
 *   .addQuery('sort', 'name')
 *   .build();
 *
 * // Result: "https://api.example.com/users/123?active=true&sort=name"
 * ```
 */
export class UrlBuilder {
  private baseUrl: string
  private paths: (string | number)[]
  private queries: string[] = []

  constructor(baseUrl: string, ...paths: (string | number)[]) {
    this.baseUrl = baseUrl.replace(/\/+$/, '') // quita slashes al final
    this.paths = paths
  }

  /**
   * Adds a query parameter to the URL.
   * Supports method chaining.
   */
  addQuery(key: string, value: string | number | boolean): this {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(String(value))
    this.queries.push(`${encodedKey}=${encodedValue}`)
    return this
  }

  /**
   * Builds the final URL.
   */
  build(): string {
    const path = this.paths
      .map(String)
      .map((p) => encodeURIComponent(p))
      .join('/')

    const fullUrl = [this.baseUrl, path].filter(Boolean).join('/')

    if (!this.queries.length) return fullUrl

    return `${fullUrl}?${this.queries.join('&')}`
  }
}
