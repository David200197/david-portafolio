/**
 * Utility class for building URLs with path segments and query parameters.
 *
 * @example
 * ```typescript
 * const builder = new UrlBuilder('https://api.example.com', 'users', '123');
 * builder.addQuery('active', true);
 * builder.addQuery('sort', 'name');
 * const url = builder.build(); // "https://api.example.com/users/123?active=true&sort=name"
 * ```
 */
export class UrlBuilder {
  private baseUrl: string;
  private urls: (string | number)[];
  private queries: string[] = [];

  /**
   * Creates an instance of UrlBuilder.
   * @param baseUrl - The base URL (e.g., "https://api.example.com").
   * @param urls - Additional path segments to append to the base URL.
   */
  constructor(baseUrl: string, ...urls: (string | number)[]) {
    this.baseUrl = baseUrl;
    this.urls = urls;
  }

  /**
   * Adds a query parameter to the URL.
   * @param key - The query parameter key.
   * @param value - The query parameter value (string, number, or boolean).
   */
  addQuery(key: string, value: string | number | boolean) {
    this.queries.push(`${key}=${value}`);
  }

  /**
   * Builds and returns the complete URL as a string, including path segments and query parameters.
   * @returns The constructed URL.
   */
  build() {
    const fullUrl = [this.baseUrl, ...this.urls].join("/");
    if (!this.queries.length) return fullUrl;
    const queryJoined = this.queries.join("&");
    return [fullUrl, queryJoined].join("?");
  }
}
