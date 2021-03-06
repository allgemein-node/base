import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {ClassLoader} from '../../src';


@suite('classloading/classloader')
class ClassloaderSpec {

  @test
  async 'load sync from directory'() {
    let tmp = null;
    if (Reflect && Reflect['getOwnMetadata']) {
      tmp = Reflect['getOwnMetadata'];
      Reflect['getOwnMetadata'] = null;
    }
    const clss = ClassLoader.importClassesFromDirectories([__dirname + '/classes/*']);
    expect(clss).to.have.length(1);
    let path = clss[0]['__SOURCE__'];
    path = path.replace(__dirname, '.');
    expect(path).to.eq('./classes/Cls01.ts');

    if (tmp) {
      Reflect['getOwnMetadata'] = tmp;
    }
  }


  @test
  async 'load async from directory'() {
    let tmp = null;
    if (Reflect && Reflect['getOwnMetadata']) {
      tmp = Reflect['getOwnMetadata'];
      Reflect['getOwnMetadata'] = null;
    }
    const clss = await ClassLoader.importClassesFromDirectoriesAsync([__dirname + '/classes/*']);
    expect(clss).to.have.length(1);
    let path = clss[0]['__SOURCE__'];
    path = path.replace(__dirname, '.');
    expect(path).to.eq('./classes/Cls01.ts');

    if (tmp) {
      Reflect['getOwnMetadata'] = tmp;
    }
  }


  @test
  async 'load sync from directories'() {
    let tmp = null;
    if (Reflect && Reflect['getOwnMetadata']) {
      tmp = Reflect['getOwnMetadata'];
      Reflect['getOwnMetadata'] = null;
    }
    const clss = ClassLoader.importClassesFromDirectories([
      __dirname + '/files/classes/*',
      __dirname + '/files/classes/subclasses/*']);
    expect(clss).to.have.length(3);
    const path = clss[0]['__SOURCE__'];
    expect(clss[0]['__SOURCE__'].replace(__dirname, '.')).to.eq('./files/classes/Cls01.ts');
    expect(clss[1]['__SOURCE__'].replace(__dirname, '.')).to.eq('./files/classes/subclasses/Cls02.ts');
    expect(clss[2]['__SOURCE__'].replace(__dirname, '.')).to.eq('./files/classes/subclasses/Cls03.ts');
    if (tmp) {
      Reflect['getOwnMetadata'] = tmp;
    }
  }


  @test
  async 'load async from directories'() {
    let tmp = null;
    if (Reflect && Reflect['getOwnMetadata']) {
      tmp = Reflect['getOwnMetadata'];
      Reflect['getOwnMetadata'] = null;
    }
    const clss = await ClassLoader.importClassesFromDirectoriesAsync([
      __dirname + '/files/classes/*',
      __dirname + '/files/classes/subclasses/*']);
    expect(clss).to.have.length(3);
    const path = clss[0]['__SOURCE__'];
    expect(clss[0]['__SOURCE__'].replace(__dirname, '.')).to.eq('./files/classes/Cls01.ts');
    expect(clss[1]['__SOURCE__'].replace(__dirname, '.')).to.eq('./files/classes/subclasses/Cls02.ts');
    expect(clss[2]['__SOURCE__'].replace(__dirname, '.')).to.eq('./files/classes/subclasses/Cls03.ts');
    if (tmp) {
      Reflect['getOwnMetadata'] = tmp;
    }
  }
}
