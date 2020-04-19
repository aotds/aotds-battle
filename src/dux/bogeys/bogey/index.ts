import Updux, { DuxState } from 'updux';
import { action, payload } from 'ts-action';
import fp from 'lodash/fp';
import orders from './orders';
import navigation from './navigation';
import u from 'updeep';
import weaponry, { inflateWeaponry } from './weaponry';
import structure, { inflateStructure } from './structure';
import { internal_damage } from './rules/checkInternalDamage';

type DriveState = {
    rating: number;
    current: number;
    damage_level?: 0 | 1 | 2;
};

type State = {
    id: string;
    name: string;
    player_id?: string;
    orders: DuxState<typeof orders>;
    drive: DriveState;
};

//--- actions

const bogey_movement = action('bogey_movement', payload<string>());

const bogey_fire = action('bogey_fire', payload<string>()); // bogey's turn to let loose
const firecon_fire = action('firecon_fire', payload<{ bogey_id: string; firecon_id: number }>());
const weapon_fire = action(
    'weapon_fire',
    payload<{
        bogey_id: string;
        target_id: string;
        weapon_id: number;
    }>(),
);

// ---

const dux = new Updux({
    initial: { id: '', name: '' } as State,
    actions: { bogey_movement, bogey_fire, firecon_fire, weapon_fire, internal_damage },
    subduxes: {
        orders,
        navigation,
        weaponry,
        structure,
    },
    selectors: {},
});

dux.addMutation(dux.actions.internal_damage, ({ system }) => (state: any) => {
    if (system !== 'drive') return state;

    const damage_level = Math.min((state.damage_level ?? 0) + 1, 2);

    return u.updateIn('drive',
        {
            current: damage_level === 1 ? state.drive.rating / 2 : 0,
            damage_level,
        },
        state,
    );
});

export default dux.asDux;

export type BogeyState = DuxState<typeof dux>;

type DriveStateShorthand = number | DriveState;

function inflateDrive(shorthand: DriveStateShorthand = 0): DriveState {
    if (typeof shorthand === 'number')
        return {
            current: shorthand,
            rating: shorthand,
            damage_level: 0,
        };

    return fp.defaults({
        damage_level: 0,
    })(shorthand);
}

export function inflateBogey(shorthand: any) {
    return u(
        {
            weaponry: inflateWeaponry,
            structure: inflateStructure,
            drive: inflateDrive,
        },
        shorthand,
    );
}
