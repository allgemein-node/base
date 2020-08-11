import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import 'reflect-metadata';
import {__SOURCE__, ClassLoader} from '../../src';


@suite('test/classloading/reflect')
class ClassloaderReflectSpec {

  @test
  async 'source in metadata'() {
    const clss = ClassLoader.importClassesFromDirectories([__dirname + '/classes/*']);
    expect(clss).to.have.length(1);
    let path = Reflect.getOwnMetadata(__SOURCE__, clss[0]);
    path = path.replace(__dirname, '.');
    expect(path).to.eq('./classes/Cls01.ts');
  }

  @test
  async 'source in metadata async'() {
    const clss = await ClassLoader.importClassesFromDirectoriesAsync([__dirname + '/classes/*']);
    expect(clss).to.have.length(1);
    let path = Reflect.getOwnMetadata(__SOURCE__, clss[0]);
    path = path.replace(__dirname, '.');
    expect(path).to.eq('./classes/Cls01.ts');
  }


  @test
  async 'load from any'() {
    const clss = ClassLoader.importClassesFromAny([__dirname + '/classes/Cls01.ts']);
    expect(clss).to.have.length(1);
    let path = Reflect.getOwnMetadata(__SOURCE__, clss[0]);
    path = path.replace(__dirname, '.');
    expect(path).to.eq('./classes/Cls01.ts');

  }

  @test
  async 'load from any async'() {
    const clss = await ClassLoader.importClassesFromAnyAsync([__dirname + '/classes/Cls01.ts']);
    expect(clss).to.have.length(1);
    let path = Reflect.getOwnMetadata(__SOURCE__, clss[0]);
    path = path.replace(__dirname, '.');
    expect(path).to.eq('./classes/Cls01.ts');

  }
}
