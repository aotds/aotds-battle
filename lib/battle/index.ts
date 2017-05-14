import * as Redux from "redux";
import _ from 'lodash';
import battle_reducer from './Reducer';

import Action from './Actions';

import Ajv = require('ajv');
import battle_schema from './Schema';

interface BattleOptions {
    state?: any;
}

interface ValidateFunction {
    validate: () => boolean;
    addSchema: ( schema: any ) => void;
};


export default
class Battle {
    store: any;

    constructor ( options : BattleOptions = {} ) {
        this.store = Redux.createStore( 
            battle_reducer,
            options.state || {}
        );

        // TODO only check for the schema in dev mode
        let ajv = new Ajv();
        ajv.addSchema( Action.$schema );
        let schema_validator = ajv.compile(battle_schema);

        this.store.subscribe( () => {
           if ( !schema_validator(this.store.getState() ) ) {
               throw schema_validator.errors;
           }
        })
    }

    init_game = payload => this.store.dispatch( 
        Action.init_game(payload)
    ) 

    get state () { return this.store.getState() }

};


