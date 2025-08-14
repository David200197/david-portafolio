type AdvanceFilterKey<T> = keyof T | (keyof T)[] | ((item: T) => string);

/**
 * Represents a generic collection of items with advanced grouping and filtering capabilities.
 *
 * @typeParam T - The type of items contained in the collection.
 */
export class Collection<T> extends Array<T> {
  constructor(...value: T[]) {
    super(...value);
  }

  /**
   * Groups the collection by a given key or function.
   * @returns A grouped collection of the same type as `this`
   */
  groupBy<K extends keyof T>(
    keyOrMethod: K | ((item: T) => string)
  ): Record<string, Collection<T>> {
    return this.reduce((group, currentValue) => {
      const groupKey =
        typeof keyOrMethod === "function"
          ? keyOrMethod(currentValue)
          : String(currentValue[keyOrMethod]);
      if (!group[groupKey]) {
        group[groupKey] = new Collection();
      }
      group[groupKey].push(currentValue);
      return group;
    }, {} as Record<string, Collection<T>>);
  }

  /**
   * Normalizes a string by removing accents and converting to lowercase.
   */
  protected normalizeString(str: string): string {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  /**
   * Extracts a set of normalized words from a given text.
   */
  protected getNormalizedWords(text: string): Set<string> {
    return new Set(this.normalizeString(text).split(/\s+/));
  }

  /**
   * Filters the collection based on a search query.
   * Overloads:
   * - advancedFilter(query): searches in all fields.
   * - advancedFilter(keys, query): searches in specific fields or custom function.
   * @returns A filtered collection of the same type as `this`
   */
  advancedFilter(query: string): this;
  advancedFilter(keys: AdvanceFilterKey<T>, query: string): this;
  advancedFilter(
    keysOrQuery: AdvanceFilterKey<T> | string,
    query?: string
  ): Collection<T> {
    let keys: AdvanceFilterKey<T>;
    let actualQuery: string;

    if (typeof query === "undefined") {
      actualQuery = keysOrQuery as string;
      keys = (item: T) =>
        Object.values(item as Record<string, unknown>).join(" "); // Search in all fields
    } else {
      keys = keysOrQuery as AdvanceFilterKey<T>;
      actualQuery = query;
    }

    if (!actualQuery.trim()) return new Collection(...this);

    const queryWords = this.getNormalizedWords(actualQuery);

    const filtered = this.filter((item) => {
      let text: string;

      if (typeof keys === "function") {
        text = keys(item);
      } else if (Array.isArray(keys)) {
        text = keys.map((key) => String(item[key] ?? "")).join(" ");
      } else {
        text = String(item[keys] ?? "");
      }

      if (typeof text !== "string") return false;

      const textWords = this.getNormalizedWords(text);

      return [...queryWords].every((qWord) =>
        [...textWords].some((tWord) => tWord.includes(qWord))
      );
    });

    return new Collection(...filtered);
  }
}
