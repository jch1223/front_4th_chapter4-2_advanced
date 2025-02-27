export const createCachedFetcher = <T,>(fetchFn: () => Promise<T>) => {
  let cache: T | null = null;
  let promise: Promise<T> | null = null;
  
  return async (): Promise<T> => {
    if (cache) {
      return cache;
    }
    
    if (!promise) {
      promise = fetchFn().then(result => {
        cache = result;
        return result;
      });
    }
    
    return promise;
  };
};