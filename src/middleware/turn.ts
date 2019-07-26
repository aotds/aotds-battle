import { try_play_turn, play_turn } from "../store/actions/phases";

import _ from 'lodash';
import { BogeyState } from "../../store/bogeys/bogey/types";
import { get_bogeys } from '../store/selectors';

import { mw_for } from './utils';

const debug = require('debug')('aotds:saga');

export
const assess_turn = ({getState,dispatch}: any) => (next:any) => (action:any) => {
    let bogeys = get_bogeys( getState() );

    // filter out all non-player bogeys
    bogeys = _.filter( bogeys, 'player' );

    next(action);

    // if none has no issued orders, go for it!
    if( ! bogeys.find( (b: BogeyState )=> !_.get( b, 'orders.issued' ) ) ) {
       dispatch( play_turn() );
    }
};

const mw_assess_turn = mw_for( try_play_turn, assess_turn );

export default mw_assess_turn;
