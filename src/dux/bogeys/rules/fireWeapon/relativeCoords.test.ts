import { relativeCoords } from './relativeCoords';
import u from '@yanick/updeep';

let attacker = { coords: [0, 0], heading: 1 };
let target: any = { coords: [0, 10], heading: 5 };

test.each([
    { coords: [0, 10], e: { angle: 0, bearing: -1 } },
    { coords: [0, -10], e: { angle: 6, bearing: 5 } },
    { coords: [10, 0], e: { angle: 3, bearing: 2 } },
])('%j', ({ coords, e }) => {
    expect(relativeCoords(attacker, u({ coords }, target))).toMatchObject(e);
});
