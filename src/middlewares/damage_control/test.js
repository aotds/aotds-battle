import _ from 'lodash';

import { ship_damage_control, damage_control } from './index';
import { ejson } from '~/utils';

import { cheatmode, rig_dice } from '~/dice';

cheatmode(true);

test( 'basic', () => {

    expect(
        ship_damage_control({
            id: 'enkidu',
            'damage_control_parties.current': 5,
            'orders.damage_control_parties': [
                { system: 'weapon', system_id: 3, parties: 4 },
                { system: 'weapon', system_id: 3, parties: 4 },
                { system: 'shield', system_id: 2, parties: 3 },
            ] ,
        } |> ejson )
    ).toMatchObject([
        { system: "weapon", parties: 3 },
        { system: "shield", system_id: 2, parties: 2 },
    ]);

});

test( 'damage_control unsuccessful', () => {

    rig_dice([3]);

    let next = jest.fn();

    damage_control({},next,{ type: 'DAMAGE_CONTROL', parties: 2 });

    expect(next).toHaveBeenCalledWith({
        dice: [ 3 ],
        parties: 2,
        repaired: false,
        type: 'DAMAGE_CONTROL',
    });
});

test( 'damage_control successful', () => {

    rig_dice([3]);
    let next = jest.fn();

    damage_control({},next,{ type: 'DAMAGE_CONTROL', parties: 3 });

    expect(next).toHaveBeenCalledWith({
        dice: [ 3 ],
        parties: 3,
        repaired: true,
        type: 'DAMAGE_CONTROL',
    });
});
