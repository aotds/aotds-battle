import * as Redux from "redux";
import _ from 'lodash';
import Reducer from './Reducer';

let battle_reducer = () => {};

interface BattleOptions {
    state?: any;
}

class AotdsType {
    readonly type : string;

    constructor() {
        this.type = Object.getPrototypeOf(this).constructor.name.toUpperCase();
    }
}

class InitGame extends AotdsType {

    constructor(options) { 
        super(); 
        Object.keys(options).forEach( k => this[k] = options[k] )
    }

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

    init_game = options => this.store.dispatch( 
        new InitGame( options )        
    );

    get state () { return this.store.getState() }

};


