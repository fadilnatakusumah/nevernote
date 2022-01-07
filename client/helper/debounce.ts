let timeOutID: any;
export const debounceFn = (fn: any, delay: number = 2000) => {
  return (...args: any) => {
    clearTimeout(timeOutID);
    timeOutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
