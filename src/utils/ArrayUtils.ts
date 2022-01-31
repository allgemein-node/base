import {TreeUtils, WalkValues} from './TreeUtils';
import {clone, get, isArray, isEqual, isNull, isNumber, isObjectLike, isUndefined, set} from 'lodash';

export class ArrayUtils {

  static merge(source: any, dest: any) {
    const changes: any[] = [];
    TreeUtils.walk(dest, (x: WalkValues) => {
      // new sub-property
      const location = x.location.join('.');

      if (x.isLeaf) {
        // is leaf - check content
        if (isNull(x.index) && x.key) {
          // object path
          const value = get(source, location, undefined);
          if (isUndefined(value)) {
            // not exists, append to source
            set(source, location, x.value);
            changes.push({type: 'missing', key: location});
          } else {
            if (value !== x.value) {
              set(source, location, x.value);
              changes.push({type: 'value', key: location, src: value, dst: x.value});
            }
          }
        } else if (isNumber(x.index)) {
          // array element
          this.mergeHandleArray(source, x, changes);
        } else {
          throw new Error('no object or array node on leaf');
        }
      } else {
        // is branch - check structure
        if (isNull(x.index) && x.key) {
          // object path
          const value = get(source, location, undefined);
          if (isUndefined(value)) {
            // not exists, append to source
            set(source, location, x.value);
            changes.push({type: 'missing', key: location});
          }
        } else if (isNumber(x.index)) {
          this.mergeHandleArray(source, x, changes);
        } else {
          throw new Error('no object or array node on branch');
        }
      }
    });
    return changes;
  }


  private static mergeHandleArray(source: any, x: WalkValues, changes: any[]) {
    // array element
    const parent = clone(x.location);
    parent.pop();
    const parentLocation = parent.join('.');
    const sourceArray = parent.length === 0 ? source : get(source, parentLocation, undefined);
    if (isArray(sourceArray)) {
      // source array exists check if value present
      const exists = sourceArray.find((y: any) => isEqual(x, x.value));
      if (!exists) {
        // add missing value
        const position = sourceArray.length;
        sourceArray.push(x.value);
        changes.push({type: 'push', key: parentLocation, position: position, value: x.value});
      }
    } else if (isUndefined(sourceArray)) {
      // source parent for appending structure is not the same
      set(source, parentLocation, [x.value]);
      changes.push({type: 'create-push', key: parentLocation, position: 0, value: x.value});
    } else if (isObjectLike(sourceArray)) {
      // source parent is an object like entry
      // todo replace this with the array
      throw new Error('structural inconsistencies: needed array to add value found object-like entry [' + parentLocation + ']');
    } else {
      throw new Error('structural inconsistencies: needed array to add value found unknown [' + parentLocation + ']');
    }

  }
}
