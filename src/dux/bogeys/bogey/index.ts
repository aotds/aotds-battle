import Updux, { DuxState } from 'updux';
import { action, payload } from 'ts-action';
import orders from './orders';
import navigation from './navigation';
import u from 'updeep';

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

// ---

const dux = new Updux({
    initial: { id: '', name: '' } as State,
    actions: { bogey_movement },
    subduxes: {
        orders,
        navigation,
    }
});

export default dux.asDux;
