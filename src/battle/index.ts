import fp from 'lodash/fp';

import { compose, createStore, applyMiddleware } from "redux";

type BattleOpts = {
    devtools: {},
}

export default class Battle {

    constructor( opts: BattleOpts ) {

        let enhancers = applyMiddleware();

        if( opts.devtools) {
            enhancers = require('remote-redux-devtools').composeWithDevTools(
                fp.defaults({port: 8000, hostname: 'localhost'}, opts.devtools)
            )( enhancers )
        }
    }

}
