import _ from 'lodash';
import u from 'updeep';

import { actions } from '~/actions';
import { cheatmode, rig_dice } from '~/dice';

import { internal_damage_check } from './index';

const debug = require('debug')('aotds:mw:sagas:weapon:test');

cheatmode();

test( 'no damage? Nothing happen internally', () => {

    let result = [ ...internal_damage_check( actions.internal_damage_check('enkidu', {
        max: 14,
        previous: 14,
        current: 14,
    })) ];

    expect(result).toHaveLength(0);
});

test( 'internal damage? Oh my', () => {

    let saga = internal_damage_check( actions.internal_damage_check('enkidu', {
        max:      14,
        previous: 14,
        current:  12,
    })) 

    let ship = { id: 'enkidu', 
        drive: { damage_level: 0 },
        weaponry: {
            weapons: { 1: { id: 1 }, 2: { id: 2, damaged: false }, 3: { id: 3, damaged: true } },
            firecons:{ 
                1: { id: 1, damaged: true },
                2: { id: 2 }, 
            },
        },
        structure: { 
            hull: { current: 14, max: 14 },
            shields: { 1: { id: 1 }, 2: { id: 2 } },
        } 
    };

    rig_dice([1,2,90,3,3,90]);

    expect(saga.next().value).toHaveProperty('SELECT');

    let result = [ saga.next(ship).value, ...saga ];

    console.log(result);

    expect(result).toMatchObject([
        { type:  'drive' },  
        { type:  'firecon',  id: 2 },    
        { type:  'weapon',   id: 2 },    
        { type:  'shield',   id: 1 },    
    ].map( system => ({ PUT: { action: { system } }})));

});
