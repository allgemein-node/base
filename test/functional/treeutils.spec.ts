import {expect} from 'chai';
import {suite, test} from '@testdeck/mocha';
import 'reflect-metadata';
import {TreeUtils} from '../../src/libs/utils/TreeUtils';
import {JsonUtils} from '../../src/libs/utils/JsonUtils';


@suite('treeutils')
class TreeutilsSpec {

  @test
  async 'tree sync walker'() {
    const tree: any = {
      str: 'y',
      obj: {z: 'entry', w: 1},
      arrEmpty: [],
      arr: [1, '2', {inArr: true}],
      subarr: [{inArr: [{insub: true}]}]
    };

    const parts: any[] = [];
    TreeUtils.walk(tree, x => {
      parts.push(x);
    });

    expect(parts).to.have.length(15);
    expect(parts[0]).to.deep.include({value: 'y', key: 'str', index: null, isLeaf: true, location: ['str']});
    expect(parts[1]).to.deep.include({
      value: {z: 'entry', w: 1},
      key: 'obj',
      index: null,
      isLeaf: false,
      location: ['obj']
    });
    // console.log(parts[2]);

  }

  @test
  async 'tree async walker'() {
    const tree: any = {
      str: 'y',
      obj: {z: 'entry', w: 1},
      arrEmpty: [],
      arr: [1, '2', {inArr: true}],
      subarr: [{inArr: [{insub: true}]}]
    };

    const parts: any[] = [];
    await TreeUtils.walkAsync(tree, x => {
      parts.push(x);
    });

    expect(parts).to.have.length(15);
    expect(parts[0]).to.deep.include({value: 'y', key: 'str', index: null, isLeaf: true, location: ['str']});
    expect(parts[1]).to.deep.include({
      value: {z: 'entry', w: 1},
      key: 'obj',
      index: null,
      isLeaf: false,
      location: ['obj']
    });
    // console.log(parts[2]);

  }

  @test
  async 'json date recorvery'() {

    // const dates = [];

    const tree: any = {
      str: new Date(1100, 2, 3),
      obj: {z: new Date(1, 2, 3)},
      bool: false, number: 1,
      arr: [new Date(2543, 2, 3, 3, 4, 5, 123), {inArr: new Date()}],
      subarr: [{inArr: [{insub: new Date(), bool: false, number: 1}]}]
    };

    let c = JSON.parse(JSON.stringify(tree));
    // console.log(inspect(c, null, 10));
    c = JsonUtils.correctTypes(c);

    // console.log(inspect(c, null, 10));
    expect(c).to.be.deep.eq(tree);
  }


  @test
  async 'do nothing on empty values'() {

    const dates = [];

    const tree: any = {
      str: null
    };

    let c = JSON.parse(JSON.stringify(tree));
    // console.log(inspect(c, null, 10));
    c = JsonUtils.correctTypes(c);

    // console.log(inspect(c, null, 10));
    expect(c).to.be.deep.eq(tree);

    c = JSON.parse(JSON.stringify(null));
    // console.log(inspect(c, null, 10));
    c = JsonUtils.correctTypes(c);

    // console.log(inspect(c, null, 10));
    expect(c).to.be.deep.eq(null);
  }
}
