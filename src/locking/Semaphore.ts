/**
 * https://gist.github.com/Gericop/e33be1f201cf242197d9c4d0a1fa7335
 */
import { EventEmitter } from 'events';

/**
 * Semaphore implementation
 */
export class Semaphore extends EventEmitter {


  /**
   * Count resource usage
   */
  private counter = 0;

  /**
   * Waiting queue
   */
  // eslint-disable-next-line no-unused-vars
  private waiting: { resolve: (value?: any) => void; err: (reason?: any) => void }[] = [];

  private readonly max: number;
  private readonly name: string;

  constructor(max: number, name: string = null) {
    super();
    this.setMaxListeners(10000);
    this.max = max;
    this.name = name;
  }

  /**
   * Take the next waiting caller
   */
  private take() {
    if (this.waiting.length > 0 && this.counter < this.max) {
      this.counter++;
      const promise = this.waiting.shift();
      promise.resolve();
    }
  }

  /**
   * Acquire semaphore for resource use
   */
  acquire() {
    if (this.counter < this.max) {
      this.counter++;
      return new Promise(resolve => {
        resolve(null);
      });
    } else {
      return new Promise((resolve, err) => {
        this.waiting.push({ resolve: resolve, err: err });
      });
    }
  }

  /**
   * Release semaphore and free resource
   */
  release() {
    this.counter--;
    this.take();
    if (this.counter === 0) {
      this.emit('empty');
    }
  }

  /**
   * Purge acquired leases
   */
  purge() {
    const unresolved = this.waiting.length;
    for (let i = 0; i < unresolved; i++) {
      this.waiting[i].err('Task has been purged.');
    }
    this.counter = 0;
    this.waiting = [];
    this.removeAllListeners();
    return unresolved;
  }

  /**
   * Has waiting entries
   */
  isReserved() {
    return this.counter > 0;
  }


  /**
   * Wait till semaphore is fully released
   */
  await(timeout = 1000) {
    if (this.counter === 0) {
      return Promise.resolve();
    } else {
      let timer: any = null;
      return new Promise((resolve, reject) => {
        const fn = () => {
          clearTimeout(timer);
          this.removeAllListeners();
          resolve(null);
        };
        this.once('empty', fn);
        timer = setTimeout(() => {
          this.removeAllListeners();
          reject(new Error('timeout waiting for free semaphore ' + this.name));
        }, timeout);
      });
    }
  }
}
