import * as Redux from "redux";
import _ from 'lodash';

let battle_reducer = () => {};

interface BattleOptions {
    state?: any;
}

export default
class Battle {
    store: any;

    constructor ( options : BattleOptions = {} ) {
        this.store = Redux.createStore( 
            battle_reducer,
            options.state || {}
        );
    }

    init_game = options => null;

    get state () { return this.store.state }

};


