import { ship_damage_control } from './index';
import { ejson } from '~/utils';

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

