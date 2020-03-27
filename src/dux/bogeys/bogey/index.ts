import Updux from 'updux';
import { action, payload } from 'ts-action';
import orders from './orders';
import u from 'updeep';

type BogeyState = {
    id: string;
    name: string;
    player_id?: string;
};

const dux = new Updux({
    initial: { id: '', name: '' } as BogeyState,
    subduxes: {
        orders,
    },
});

export default dux.asDux;
