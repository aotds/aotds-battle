import Updux, { DuxState } from 'updux';
import bogey from './bogey';
import fp from 'lodash/fp';
import u from 'updeep';
import play_phases from '../playPhases';
import subactions from '../subactions';
import { action, payload } from 'ts-action';

type BogeyState = DuxState<typeof bogey>;

const getBogey=(bogeys: BogeyState[]) => (id: string) => fp.find({ id }, bogeys);

// -- actions

const { bogey_movement, bogey_movement_move } = bogey.actions;

// --

const dux = new Updux({
    initial: [] as BogeyState[],
    subduxes: {
        '*': bogey,
    },
    selectors: { getBogey },
});

const singleBogey: any = (prop = 'bogey_id') => (payload, action) =>
    u.map(u.if(fp.matches({ id: payload[prop] }), bogey.upreducer(action)));

dux.addMutation(bogey.actions.set_orders, singleBogey(), true);

dux.addEffect( play_phases.actions.movement_phase, subactions(
    ({getState,dispatch}) => () => {
        fp.map( 'id', getState() ).forEach( id => dispatch( bogey_movement(id) ) )
    }
) );

dux.addEffect( bogey_movement, subactions(
    ({getState,dispatch}) => (action: ReturnType<typeof bogey_movement>) => {
        const bogey = getBogey(getState())(action.payload);

        dispatch(bogey_movement_move( action.payload, {} ));
    }
) );

export default dux.asDux;
