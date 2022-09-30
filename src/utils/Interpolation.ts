import {TreeUtils, WalkValues} from './TreeUtils';
import {isString} from 'lodash';

const REGEX = /\${[^}]+}/g;


export class Interpolation {

  static exec(data: any, ...lookup: any[]): void {

    if (!lookup.length) {
      lookup = [data];
    } else {
      if (Array.isArray(lookup[0])) {
        lookup = lookup[0];
      }
    }

    TreeUtils.walk(data, (x: WalkValues) => {
      let v = x.value;
      if (isString(v) && REGEX.test(v)) {
        const match = v.match(REGEX);
        match.forEach(_match => {
          const content = _match.replace(/^\${|}$/g, '');
          const splits = content.split(':-', 2);
          const path = splits.shift();
          const hasFallback = splits.length > 0;
          const fallback = splits.shift();
          let _value = null;

          for (let i = 0; i < lookup.length; i++) {
            _value = this.get(lookup[i], path);
            if (_value) {
              break;
            }
          }

          if (_value) {
            if (x.index !== null) {
              x.parent[x.index] = v = v.replace(_match, _value);
            } else {
              x.parent[x.key] = v = v.replace(_match, _value);
            }
          } else {
            if (hasFallback) {
              if (x.index !== null) {
                x.parent[x.index] = v = v.replace(_match, fallback);
              } else {
                x.parent[x.key] = v = v.replace(_match, fallback);
              }
            }
          }
        });
      }
    });

  }


  static get(arr: any, path: string = null): any {
    if (path) {
      const paths = path.split('.');
      let first: string | number = paths.shift();
      if (/^[1-9]+\d*$/.test(first)) {
        first = parseInt(first, 10);
      }
      // eslint-disable-next-line no-prototype-builtins
      if (arr.hasOwnProperty(first)) {
        const pointer: any = arr[first];
        if (paths.length === 0) {
          return pointer;
        } else {
          return this.get(pointer, paths.join('.'));
        }
      } else {
        // not found
        return null;
      }

    }
    return arr;

  }


}
