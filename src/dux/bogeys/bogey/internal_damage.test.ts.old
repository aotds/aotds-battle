import tap from 'tap';
import dux, { inflateBogey } from '.';

declare function require(name: string): any;
const debug = require('debug')('aotds:internal');

const { reducer, actions: { internal_damage } } = dux;

const bogey = inflateBogey({
    drive: 8,
    weaponry: {
    shields: [ 1, 2 ],
    firecons: 3,
    weapons: [ {}, {}]}
});

tap.match(
    (reducer as any)( bogey, internal_damage({ system: 'drive' } as any) ).drive,{
        damage_level: 1,
        current: 4,
    }, "drive"
)

tap.match(
    (reducer as any)( bogey, internal_damage({ system: 'shield', system_id: 2} as any) ).weaponry.shields[1],{
        damaged: true
    }, 'shield'
);
tap.match(
    (reducer as any)( bogey, internal_damage({ system: 'weapon', system_id: 2} as any) ).weaponry.weapons[1],{
        damaged: true
    }, 'weapon'
);
tap.match(
    (reducer as any)( bogey, internal_damage({ system: 'firecon', system_id: 2} as any) ).weaponry.firecons[1],{
        damaged: true
    }, 'firecon'
);
