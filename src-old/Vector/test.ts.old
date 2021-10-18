import tap from 'tap';

import Vector, {V} from '.';
import _ from 'lodash';

tap.test('basics', async (t) => {

    t.equal( V([3,4]).dot([3,4]), 25);

    t.equal(V([3,4]).length(), 5);

    t.match( V([2,3]).subtract([1,1]).v, [1,2]);

    // normalize
    const normalized = V([3,4]).normalize();

    t.equal(
        normalized.v[0].toFixed(1), "0.6" );

    t.equal( normalized.length(), 1);

    // angles
    t.equal(  V([0,1]).angle(), 0 );
    t.equal( V([1,0]).angle(), Math.PI/2 );
    t.equal( V([1,0]).angle('arc'), 3);

});

tap.test('rotate', async (t) => {

    t.match( V([0,1]).rotateBy(3,'arc').v.map( x => _.round(x,2) ), [1,0]);
    t.equal( V([0,1]).rotateBy(3,'arc').angle('arc'),3);
    t.equal( V([0,1]).rotateBy(3,'arc').length(),1);

});
