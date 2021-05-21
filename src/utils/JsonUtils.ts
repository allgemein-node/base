import {isNumber, isString} from 'lodash';
import {TreeUtils} from './TreeUtils';
import {ISO8601} from '../Constants';

export class JsonUtils {

  static parse(json: string) {
    let _json = JSON.parse(json);
    _json = this.correctTypes(_json);
    return _json;
  }

  static correctTypes(c: any) {
    TreeUtils.walk(c, x => {
        if (x.value && isString(x.value) && x.value.length < 48 && x.value.length > 0) {
          if (ISO8601.test(x.value)) {
            const date = new Date(x.value);
            if (isNumber(x.index)) {
              x.parent[x.index] = date;
            } else {
              x.parent[x.key] = date;
            }
          }
        }
      }
    );
    return c;
  }


  static stringify(obj: any) {
    return JSON.stringify(obj);
  }
}
