import u from 'updeep';

import { internal_damage } from './index';

import A from  '../../actions';

import { cheatmode, rig_dice } from '../../dice';

const debug = require('debug')('aotds:mw:weapon:test');

cheatmode();

test( 'no damage? Nothing happen', () => {
    let store = { getState: jest.fn(), dispatch: jest.fn() };
    let next = jest.fn();

    let ship = { id: 'enkidu', structure: { hull: { current: 14, max: 14 } } };

    store.getState.mockImplementation( () => ({
        objects: [ ship ]
    }));

    let result = internal_damage(store)(next)(A.damage('enkidu'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(store.dispatch).not.toBeCalled();
});

test( 'damage? Oh my', () => {
    let store = { getState: jest.fn(), dispatch: jest.fn() };
    let next = jest.fn();

    let ship = { id: 'enkidu', 
        drive: { damage_level: 0 },
        weaponry: {
            weapons: [ { id: 1 }, { id: 2, damaged: false }, { id: 3, damaged: true } ],
            firecons: [ 
                { id: 1, damaged: true },
                { id: 2 },
            ],
        },
        structure: { 
            hull: { current: 14, max: 14 },
            shields: [ { id: 1 }, { id: 2 } ],
        } 
    };

    store.getState
        .mockImplementationOnce( () => ({ objects: [ ship ] }))
        .mockImplementationOnce( () => ({ objects: [ u.updateIn( 'structure.hull.current', 12)(ship) ] }));

    rig_dice([1,2,90,3,3,90]);

    let result = internal_damage(store)(next)(A.damage('enkidu'));
    debug(result);

    expect(result).toMatchObject([
        { system: { type:  'drive' } },    
        { system: { type:  'firecon',  id: 2 } },    
        { system: { type:  'weapon',   id: 2 } },    
        { system: { type:  'shield',   id: 1 } },    
    ]);

    expect(next).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledTimes(4);
});
