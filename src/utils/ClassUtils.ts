import {isNull, isNumber, find, isString, snakeCase, concat, isArray, keys, isFunction, isObject} from 'lodash';
import {__SOURCE__} from '../Constants';

export class ClassUtils {
  static getClassName(klass: string | Function) {
    if (isString(klass)) {
      return klass;
    } else if (isFunction(klass)) {
      return klass.name;
    } else if (isObject(klass)) {
      return klass.constructor.name;
    } else {
      throw new Error('class not found!');
    }
  }


  static getFunction(klass: string | Function) {
    if (isString(klass)) {
      // TODO create error class
      throw new Error('class not found! 02');
    } else if (isFunction(klass)) {
      return klass;
    } else if (isObject(klass)) {
      return klass.constructor;
    } else {
      // TODO create error class
      throw new Error('class not found! 01');
    }
  }

  static getSource(cls: Function): string {
    let _path = null;
    if (Reflect && Reflect['getOwnMetadata']) {
      _path = Reflect['getOwnMetadata'](__SOURCE__, cls as object);
    } else {
      _path = cls[__SOURCE__] ? cls[__SOURCE__] : null;
    }
    return _path;
  }

}
