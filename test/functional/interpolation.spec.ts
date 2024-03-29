import {expect} from 'chai';
import {suite, test} from '@testdeck/mocha';
import 'reflect-metadata';
import {TreeUtils} from '../../src/utils/TreeUtils';
import {JsonUtils} from '../../src/utils/JsonUtils';
import {Interpolation} from '../../src/utils/Interpolation';


@suite('functional/interpolation')
class InterpolationSpec {


  @test
  'exec'() {
    // simple test
    let data: any = {x: 'test', y: '${x}'};
    const x = Interpolation.get(data, 'x');
    expect(x).to.eq('test');

    Interpolation.exec(data);
    expect(data).to.deep.eq({x: 'test', y: 'test'});

    data = {x: 'test', y: 'inline ${x}!'};
    Interpolation.exec(data);
    expect(data).to.deep.eq({x: 'test', y: 'inline test!'});

    // test array interpolation
    data = {x: 'test', y: ['inline ${x}!']};
    Interpolation.exec(data);
    expect(data).to.deep.eq({x: 'test', y: ['inline test!']});

    // test multiple interpolations in one line
    data = {x: 'test', z: 5, y: ['inline ${x} and ${z}!']};
    Interpolation.exec(data);

    expect(data).to.deep.eq({x: 'test', z: 5, y: ['inline test and 5!']});

    // interpolate against a lookup object
    data = {y: ['inline ${x} and ${z}!']};
    Interpolation.exec(data, {x: 'test', z: 5});
    expect(data).to.deep.eq({y: ['inline test and 5!']});

    // interpolate against multiple lookup objects
    data = {y: ['inline ${x} and ${z}!']};
    Interpolation.exec(data, {x: 'test'}, {z: 5});
    expect(data).to.deep.eq({y: ['inline test and 5!']});

    // interpolate against multiple lookup objects as array
    data = {y: ['inline ${x} and ${z}!']};
    Interpolation.exec(data, [{x: 'test'}, {z: 5}]);
    expect(data).to.deep.eq({y: ['inline test and 5!']});
  }

  @test
  'test fallback string'() {
    const data = {y: ['inline ${x:-fallback}']};
    Interpolation.exec(data, []);
    expect(data).to.deep.eq({y: ['inline fallback']});
  }
}
