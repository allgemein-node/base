import {isArray, isDate, isNull, isNumber, isObject, isObjectLike, isString, keys} from 'lodash';
import {isNumberObject, isStringObject} from 'util/types';

export interface WalkValues {
  value: any;
  key: string | number;
  index: number;
  location: any;
  parent: any;
  isLeaf: boolean;
}

export class TreeUtils {

  static isLeaf(el: any) {
    return !(isArray(el) || (isObject(el) && !(isNumberObject(el) || isStringObject(el) || isDate(el))));
  }

  static walk(root: any, fn: (x: WalkValues) => void) {
    function walk(obj: any, parent: any = null, key: string | number = null, location: any[] = []) {
      if (obj === null || obj === undefined) {
        return;
      }
      if (isArray(obj)) {
        obj.forEach((el: any, j: number) => {
          const isLeaf = TreeUtils.isLeaf(el);
          fn({
            value: el,
            key: key,
            index: j,
            location: [...location, ...[j]],
            parent: obj,
            isLeaf: isLeaf
          });
          if (!isLeaf) {
            walk(el, j, el, key ? [...location, ...[key], ...[j]] : [...location, ...[j]]);
          }
        });
      } else if (isObjectLike(obj)) {
        keys(obj).forEach((_key: string) => {
          const isLeaf = TreeUtils.isLeaf(obj[_key]);
          // const isLeaf = !isArray(obj[_key]) && !isObjectLike(obj[_key]);
          fn({
            value: obj[_key],
            key: _key,
            parent: obj,
            index: null,
            location: [...location, ...[_key]],
            isLeaf: isLeaf
          });
          if (!isLeaf) {
            walk(obj[_key], obj, _key, [...location, ...[_key]]);
          }
        });
      } else {
        fn({
          value: obj,
          key: key,
          parent: parent,
          index: null,
          location: [...location],
          isLeaf: true
        });
      }
    }

    walk(root);
  }


  static async walkAsync(root: any, fn: (x: WalkValues) => void) {
    async function walk(obj: any, parent: any = null, key: string | number = null, location: any[] = []) {
      if (obj === null || obj === undefined) {
        return;
      }
      if (isArray(obj)) {
        for (let j = 0; j < obj.length; j++) {
          const el = obj[j];
          const isLeaf = !isArray(el) && !isObjectLike(el);
          await fn({
            value: el,
            key: key,
            index: j,
            location: [...location, ...[j]],
            parent: obj,
            isLeaf: isLeaf
          });
          if (!isLeaf) {
            await walk(el, j, el, key ? [...location, ...[key], ...[j]] : [...location, ...[j]]);
          }
        }
      } else if (isObjectLike(obj)) {
        for (const _key of keys(obj)) {
          const isLeaf = !isArray(obj[_key]) && !isObjectLike(obj[_key]);
          await fn({
            value: obj[_key],
            key: _key,
            parent: obj,
            index: null,
            location: [...location, ...[_key]],
            isLeaf: isLeaf
          });
          if (!isLeaf) {
            await walk(obj[_key], obj, _key, [...location, ...[_key]]);
          }
        }
      } else {
        await fn({
          value: obj,
          key: key,
          parent: parent,
          index: null,
          location: [...location],
          isLeaf: true
        });
      }
    }

    await walk(root);
  }


}
