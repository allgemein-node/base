import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {ArrayUtils} from '../../src/utils/ArrayUtils';


@suite('functional/arrayutils')
class ArrayUtilsSpec {


  @test
  async 'merge two mapping objects - empty objects'() {
    const src = {};
    const dest = {};
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.eq(dest);
    expect(changes).to.be.deep.eq([]);
  }


  @test
  async 'merge two mapping objects - empty array'() {
    const src: any = [];
    const dest: any = [];
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.eq(dest);
    expect(changes).to.be.deep.eq([]);
  }

  @test
  async 'merge two mapping objects - both are equal - no changes detected'() {
    const src = {type: 'text'};
    const dest = {type: 'text'};
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.include(dest);
    expect(changes).to.be.deep.eq([]);
  }


  @test
  async 'merge two mapping objects - should extended by additional key'() {
    const src = {keyOld: {type: 'text'}};
    const dest = {keyNew: {type: 'text'}};
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.include(dest);
    expect(changes).to.be.deep.eq([
      {
        'key': 'keyNew',
        'type': 'missing'
      }
    ]);
  }


  @test
  async 'merge two mapping objects - should change single value'() {
    const src = {key: {type: 'text'}};
    const dest = {key: {type: 'long'}};
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.include(dest);
    expect(changes).to.be.deep.eq([
      {
        'dst': 'long',
        'key': 'key.type',
        'src': 'text',
        'type': 'value'
      }
    ]);
  }


  @test
  async 'merge two mapping objects - should add member in deep'() {
    const src = {key: {properties: {subkeySrc: {type: 'text'}}}};
    const dest = {key: {properties: {subkeyDst: {type: 'text'}}}};
    const changes = ArrayUtils.merge(src, dest);
    expect(src.key.properties).to.be.deep.include(dest.key.properties);
    expect(changes).to.be.deep.eq([
      {
        'key': 'key.properties.subkeyDst',
        'type': 'missing'
      }
    ]);
  }


  @test
  async 'merge two mapping objects - should add array value'() {
    const src: any[] = [];
    const dest: any[] = ['test'];
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.eq(dest);
    expect(changes).to.be.deep.eq([
      {
        'key': '',
        'position': 0,
        'type': 'push',
        'value': 'test'
      }
    ]);
  }


  @test
  async 'merge two mapping objects - should add array value to object with array'() {
    const src: any = {key: []};
    const dest: any = {key: ['test']};
    const changes = ArrayUtils.merge(src, dest);
    expect(src).to.be.deep.include(dest);
    expect(changes).to.be.deep.eq([
      {
        'key': 'key',
        'position': 0,
        'type': 'push',
        'value': 'test'
      }
    ]);
  }

  @test
  async 'merge two mapping objects - structure collision between object and array'() {
    const src: any = {key: {test: 'test'}};
    const dest: any = {key: ['test']};

    expect(function () {
      ArrayUtils.merge(src, dest);
    }).to.throw(
      'structural inconsistencies: needed array to add value found object-like entry [key]'
    );
  }


}
