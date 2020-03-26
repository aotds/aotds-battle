import Updux, { DuxState } from "updux";
import bogey from './bogey';
import fp from 'lodash/fp';
import u from 'updeep';

type BogeyState = DuxState< typeof bogey >;

const dux = new Updux({
    initial: [] as BogeyState[],
    subduxes: {
        '*': bogey
    },
    selectors: {
        getBogey: (bogeys: BogeyState[] ) => ( id: string ) => fp.find({ id }, bogeys)
    }
});

const singleBogey: any = ( prop = 'bogey_id' )  =>
    (payload,action) => u.map(
        u.if( fp.matches({id: payload[prop]}), bogey.upreducer(action) )
    );

dux.addMutation( bogey.actions.set_orders, singleBogey(), true );

export default dux.asDux;

