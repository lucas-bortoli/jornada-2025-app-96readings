export default class Deferred<T> {
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  promise: Promise<T>;

  constructor() {
    this.resolve = () => {};
    this.reject = () => {};
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}
