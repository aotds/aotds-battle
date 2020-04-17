import Updux, { DuxState } from 'updux';
import { action, payload } from 'ts-action';
import orders from './orders';
import navigation from './navigation';
import u from 'updeep';
import weaponry, { inflateWeaponry } from './weaponry';
import structure, { inflateStructure } from './structure';

type State = {
    id: string;
    name: string;
    player_id?: string;
    orders: DuxState<typeof orders>;
    drive: {
        rating: number;
        current: number;
    }
};

//--- actions

const bogey_movement = action('bogey_movement', payload<string>());

const bogey_fire = action('bogey_fire', payload<string>()); // bogey's turn to let loose
const firecon_fire = action( 'firecon_fire', payload<{bogey_id: string; firecon_id: number;}>() );
const weapon_fire = action( 'weapon_fire', payload<{
    bogey_id: string;
    target_id: string;
    weapon_id: number;
}>() );

// ---

const dux = new Updux({
    initial: { id: '', name: '' } as State,
    actions: { bogey_movement, bogey_fire,
        firecon_fire, weapon_fire },
    subduxes: {
        orders,
        navigation,
        weaponry,
        structure,
    },
    selectors: {
    }

});

export default dux.asDux;

export type BogeyState = DuxState<typeof dux>;

export function inflateBogey(shorthand: any) {
    return u({
        weaponry: inflateWeaponry,
        structure: inflateStructure,
    }, shorthand)
}
