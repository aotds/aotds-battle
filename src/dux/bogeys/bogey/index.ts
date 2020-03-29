import Updux, { DuxState } from 'updux';
import { action, payload } from 'ts-action';
import orders from './orders';
import navigation from './navigation';
import u from 'updeep';
import fp from 'lodash/fp';

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

const getFirecon = state => id => fp.find(id,state.weaponry.firecons);

const dux = new Updux({
    initial: { id: '', name: '' } as State,
    actions: { bogey_movement },
    subduxes: {
        orders,
        navigation,
    },
    selectors: {
        getFirecon
    }

});

export default dux.asDux;
