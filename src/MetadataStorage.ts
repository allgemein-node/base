import {has} from 'lodash';


export class MetadataStorage {


  [k: string]: any;


  static $self: MetadataStorage;


  static $() {
    if (!this.$self) {
      this.$self = new MetadataStorage();
    }
    return this.$self;
  }


  static key(k: string): any[] {
    return this.$().key(k);
  }


  static clear() {
    this.$self = null;
  }

  /**
   * Create or get a cached key by object / array
   *
   * @param key
   * @param initial
   */
  key(key: string, initial: any = []): any[] {
    if (!has(this, key)) {
      this[key] = initial;
    }
    return this[key];
  }


  has(path: string) {
    return has(this, path);
  }


  get(key: string) {
    if (has(this, key)) {
      return this[key];
    }
    return undefined;
  }


  remove(key: string) {
    if (has(this, key)) {
      delete this[key];
    }
  }

}
