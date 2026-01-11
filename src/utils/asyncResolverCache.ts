export type CacheFetcher<T> = (key: string) => Promise<T>;

export class AsyncResolverCache<T> {
  private fetcher: CacheFetcher<T>;
  private cache: Map<string, T>;

  constructor(fetcher: CacheFetcher<T>) {
    this.fetcher = fetcher;
    this.cache = new Map();
  }

  async get(key: string): Promise<T | undefined> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const value = await this.fetcher(key);
    this.cache.set(key, value);
    return value;
  }
}