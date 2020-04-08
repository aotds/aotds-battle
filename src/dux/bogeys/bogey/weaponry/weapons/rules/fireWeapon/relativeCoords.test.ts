import tap from 'tap';
import {relativeCoords} from './relativeCoords';
import u from 'updeep';

let attacker = {coords: [0, 0], heading: 1};
let target : any = {coords: [0, 10], heading: 5};

[
    {coords: [0, 10], e: {angle: 0, bearing: -1}},
    {coords: [0, -10], e: {angle: 6, bearing: 5}},
    {coords: [10, 0], e: {angle: 3, bearing: 2}},
].forEach(({coords, e}) => {
    tap.match(relativeCoords(attacker as any, u({coords} as any)(target)) as any, e, JSON.stringify(coords));
});
