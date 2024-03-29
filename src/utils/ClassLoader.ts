/**
 *
 * @see https://github.com/typeorm/typeorm/blob/master/src/util/DirectoryExportedClassesLoader.ts
 *
 */

import {concat, isArray, isNull, isString, keys} from 'lodash';
import {PlatformUtils} from './PlatformUtils';
import {StringOrFunction} from '../Constants';
import {FileUtils} from './FileUtils';
import {ClassUtils} from './ClassUtils';


const __SOURCE__ = '__SOURCE__';

/**
 * Loads all exported classes from the given directory.
 */
export class ClassLoader {

  static importClassesFromAny(o: StringOrFunction[]): Function[] {
    let klasses: Function[] = [];
    o.forEach(x => {
      if (isString(x)) {
        const _x = PlatformUtils.pathNormilize(PlatformUtils.pathResolve(x));
        const exported = ClassLoader.importClassesFromDirectories([_x]);
        klasses = klasses.concat.apply(klasses, exported);
      } else if (x instanceof Function) {
        klasses.push(x);
      } else {
        throw new Error('TODO: unknown ' + x);
      }
    });
    return klasses;
  }

  static importClassesFromAnyAsync(o: StringOrFunction[]): Promise<Function[]> {
    return Promise.all(o.map(async x => {
      if (isString(x)) {
        const _x = PlatformUtils.pathNormilize(PlatformUtils.pathResolve(x));
        return ClassLoader.importClassesFromDirectoriesAsync([_x]);
      } else if (x instanceof Function) {
        return [x];
      } else {
        throw new Error('TODO: unknown ' + x);
      }
    })).then(x => {
      return concat([], ...x);
    });
  }


  static importClassesFromDirectories(directories: string[], formats = ['.js', '.ts']): Function[] {

    const allFiles = directories.reduce((allDirs, dir) => {
      const x = PlatformUtils.pathNormilize(dir);
      const y = PlatformUtils.load('glob').sync(x);
      return allDirs.concat(y);
    }, [] as string[]);

    const dirs: { loaded: any, source: string }[] = allFiles
      .filter(file => {
        const dtsExtension = file.substring(file.length - 5, file.length);
        return formats.indexOf(PlatformUtils.pathExtname(file)) !== -1 && dtsExtension !== '.d.ts';
      })
      .map(file => {
        const cls = {
          source: file,
          loaded: PlatformUtils.load(PlatformUtils.pathResolve(file))
        };
        return cls;
      });

    return this.filterClasses(dirs, []); // this.loadFileClasses(dirs, []);
  }


  static async importClassesFromDirectoriesAsync(directories: string[], formats = ['.js', '.ts']): Promise<Function[]> {
    let allFiles: string[] = [];
    const promises = [];
    for (const dir of directories) {
      const x = PlatformUtils.pathNormilize(dir);
      promises.push(FileUtils.glob(x));
    }
    await Promise.all(promises).then(r => {
      allFiles = allFiles.concat(...r);
    });

    const dirs: { loaded: any, source: string }[] = await Promise.all(allFiles
      .filter(file => {
        const dtsExtension = file.substring(file.length - 5, file.length);
        return formats.indexOf(PlatformUtils.pathExtname(file)) !== -1 && dtsExtension !== '.d.ts';
      })
      .map(file => PlatformUtils.pathResolve(file))
      .filter(file => PlatformUtils.fileExist(file))
      .map(async file => {
        try {
          const cls = {
            source: file,
            loaded: await PlatformUtils.loadAsync(file)
          };
          return cls;
        } catch (e) {
          console.error('Error occured on file ' + file);
          console.error(e);
          return null;
        }
      }));
    return this.filterClasses(dirs.filter(x => !isNull(x)), []); // this.loadFileClasses(dirs, []);
  }


  /**
   * Loads all json files from the given directory.
   */
  static importJsonsFromDirectories(directories: string[], format = '.json'): any[] {

    const allFiles = directories.reduce((allDirs, dir) => {
      return allDirs.concat(PlatformUtils.load('glob').sync(PlatformUtils.pathNormilize(dir)));
    }, [] as string[]);

    return allFiles
      .filter(file => PlatformUtils.pathExtname(file) === format)
      .map(file => PlatformUtils.load(PlatformUtils.pathResolve(file)));
  }

  /**
   * Loads all json files from the given directory.
   */
  static async importJsonsFromDirectoriesAsync(directories: string[], format = '.json'): Promise<any[]> {
    let allFiles: string[] = [];
    const promises = [];
    for (const dir of directories) {
      const x = PlatformUtils.pathNormilize(dir);
      promises.push(FileUtils.glob(x));
    }
    await Promise.all(promises).then(r => {
      allFiles = allFiles.concat(...r);
    });

    return allFiles
      .filter(file => PlatformUtils.pathExtname(file) === format)
      .map(file => PlatformUtils.load(PlatformUtils.pathResolve(file)));
  }


  static getSource(cls: Function): string {
    return ClassUtils.getSource(cls);
  }


  static getClassName(klass: string | Function) {
    return ClassUtils.getClassName(klass);
  }


  static getFunction(klass: string | Function) {
    return ClassUtils.getFunction(klass);
  }


  private static filterClasses(exported: { loaded: any, source: string } | { loaded: any, source: string }[], allLoaded: Function[]) {
    if (isArray(exported)) {
      exported.forEach(e => this.filterClasses(e, allLoaded));
    } else {
      if (exported.loaded instanceof Function) {
        if (Reflect && Reflect['getOwnMetadata']) {
          Reflect['defineMetadata'](__SOURCE__, exported.source, exported.loaded);
        } else {
          exported.loaded.__SOURCE__ = exported.source;
        }
        allLoaded.push(exported.loaded);
      } else if (exported.loaded instanceof Object) {
        keys(exported.loaded).forEach(key => this.filterClasses({
          loaded: exported.loaded[key],
          source: exported.source
        }, allLoaded));
      } else if (exported.loaded instanceof Array) {
        exported.loaded.forEach((i: any) => this.filterClasses({
          loaded: i,
          source: exported.source
        }, allLoaded));
      }
    }

    return allLoaded;
  }


  private static loadFileClasses(exported: any, allLoaded: Function[]) {
    if (exported instanceof Function) {
      allLoaded.push(exported);
    } else if (exported instanceof Object) {
      Object.keys(exported).forEach(key => this.loadFileClasses(exported[key], allLoaded));

    } else if (exported instanceof Array) {
      exported.forEach((i: any) => this.loadFileClasses(i, allLoaded));
    }

    return allLoaded;
  }
}
