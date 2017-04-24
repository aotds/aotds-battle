import * as Redux from "redux";
import _ from 'lodash';
import battle_reducer from './Reducer';

interface BattleOptions {
    state?: any;
}

interface AotdsType {
    readonly type : string;

    payload?: any;
}

interface InitGame extends AotdsType {
    type: 'INIT_GAME';
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

    init_game = payload => this.store.dispatch( 
        { type: 'INIT_GAME', payload }            
    ) 

    get state () { return this.store.getState() }

};


