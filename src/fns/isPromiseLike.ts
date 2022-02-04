export function isPromiseLike(obj: any) {
  return (obj !== null) &&
    ((typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function');
}
