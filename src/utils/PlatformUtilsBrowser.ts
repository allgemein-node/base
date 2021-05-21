/**
 * see https://github.com/typeorm/typeorm/blob/master/src/platform/PlatformTools.ts
 */

import {isString} from 'lodash';
import {NotSupportedError} from '../exceptions/NotSupportedError';


// const FILEPATH = path.sep === '/' ? /^(\.|\.\/|\/)([\w\/\.\-_ ]*)$/ : /^(?:[a-zA-Z]\:|\\\\[\w\.]+\\[\w.$]+)\\(?:[\w]+\\)*\w([\w.])+$/;

/**
 * Platform-specific tools.
 */
export class PlatformUtils {

  /**
   * Type of the currently running platform.
   */
  static type: 'browser' | 'node' = 'node';

  static workdir: string = null;

  /**
   * Gets global variable where global stuff can be stored.
   */
  static getGlobalVariable(): any {
    return global;
  }


  /**
   * set workdir
   */
  static setWorkDir(workdir: string) {
    if (isString(workdir)) {
      this.workdir = PlatformUtils.pathResolve(workdir);
    } else {
      this.workdir = null;
    }
  }


  static join(...args: string[]) {
    return args.join('/');
  }

  static load(name: string): any {
    throw new NotSupportedError('not supported');
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathNormilize(pathStr: string): string {
    throw new NotSupportedError('not supported');
  }

  /**
   * Gets file extension. Does "path.extname".
   */
  static pathExtname(pathStr: string, dotted: boolean = true): string {
    throw new NotSupportedError('not supported');
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathResolve(pathStr: string): string {
    throw new NotSupportedError('not supported');
  }

  /**
   * Resolved given path. Does "path.resolve".
   */
  static pathNormAndResolve(pathStr: string): string {
    return this.pathNormilize(this.pathResolve(pathStr));
  }

  static isFile(pathStr: string): boolean {
    throw new NotSupportedError('not supported');
  }

  static isDir(pathStr: string): boolean {
    throw new NotSupportedError('not supported');
  }

  /**
   * Synchronously checks if file exist. Does "fs.existsSync".
   */
  static fileExist(pathStr: string): boolean {
    throw new NotSupportedError('not supported');
  }

  /**
   * Returns the basename of a file
   */
  static basename(pathStr: string): string {
    throw new NotSupportedError('not supported');
  }

  static withoutInterpolation(str: string, fn: (str: string) => string) {
    if (/\$\{.*\}/.test(str)) {
      // has interpolations
      const regex = new RegExp(/\$\{.*\}/g);
      const m = regex.exec(str);
      const cache = {};
      let inc = 0;
      for (const _m of m) {
        const r = '###' + (inc++) + '###';
        str = str.replace(_m, r);
        cache[r] = _m;
      }
      str = fn(str);
      for (const _m in cache) {
        if (cache.hasOwnProperty(_m)) {
          str = str.replace(_m, cache[_m]);
        }
      }
    }
    return str;
  }

  /**
   * Returns the filename only (without extension)
   */
  static filename(pathStr: string): string {
    throw new NotSupportedError('not supported');
  }


  /**
   * Returns the dirname of the file
   */
  static dirname(pathStr: string): string {
    throw new NotSupportedError('not supported');
  }


  static testForFilePath(path: string) {
    throw new NotSupportedError('not supported');
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathNormalize(pathStr: string): string {
    throw new NotSupportedError('not supported');
  }

  /**
   * Normalizes given path. Does "path.normalize".
   */
  static pathResolveAndNormalize(pathStr: string): string {
    return this.pathNormalize(this.pathResolve(pathStr));
  }


  /**
   * Test if path is absolute.
   */
  static isAbsolute(pathStr: string): boolean {
    throw new NotSupportedError('not supported');
  }

  static directory(file: string): string {
    throw new NotSupportedError('not supported');
  }


  /**
   * Gets environment variable.
   */
  static getEnvVariable(name: string): any {
    return process.env[name];
  }


  static getHostPath(): string {
    throw new NotSupportedError('not supported');
  }

  static getHostFileContent(): string {
    throw new NotSupportedError('not supported');
  }

  static mkdir(targetDir: string, sep: string = null): boolean {
    throw new NotSupportedError('not supported');
  }


  static readFile(filename: string): Promise<Buffer> {
    throw new NotSupportedError('not supported');
  }

  static readFileSync(filename: string): Buffer {
    throw new NotSupportedError('not supported');
  }

  static deleteFile(dir: string, file: string): Promise<{}> {
    throw new NotSupportedError('not supported');
  }

  static deleteDirectory(dir: string): Promise<{}> {
    throw new NotSupportedError('not supported');
  }


}
