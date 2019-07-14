import { try_play_turn, play_turn } from "../store/actions/phases";
import { takeEvery, select, put } from "redux-saga/effects";

import _ from 'lodash';
import { BogeyState } from "../../store/bogeys/bogey/types";

const debug = require('debug')('aotds:saga');


export
function* assess_turn() {
    let bogeys = yield select( state => _.values(state.bogeys) );

    // filter out all non-player bogeys
    bogeys = _.filter( bogeys, 'player' );

    // if any has no issued orders, abort
    if( bogeys.find( (b: BogeyState )=> !_.get( b, 'orders.issued' ) ) ) {
        return;
    }

    return put( play_turn() );
}

export function* try_turn_saga() {
    yield takeEvery( try_play_turn.type, assess_turn );
}
