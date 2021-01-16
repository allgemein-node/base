import * as _ from 'lodash';

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
    if (!_.has(this, key)) {
      this[key] = initial;
    }
    return this[key];
  }


  has(path: string) {
    return _.has(this, path);
  }


  get(key: string) {
    if (_.has(this, key)) {
      return this[key];
    }
    return undefined;
  }


  remove(key: string) {
    if (_.has(this, key)) {
      delete this[key];
    }
  }

}
