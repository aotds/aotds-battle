import Battle from '../src';

import { AsyncNodeStorage } from 'redux-persist-node-storage'

let battle = new Battle({ persist: { 
    key: "potato",
    storage: new AsyncNodeStorage('./here'),
} });

battle.persistReady.then( () => {
    battle.dispatch_action( 'init_game', { game: { name: 'bob', players: [ { id: "yanick" } ] },
        bogeys: [ { 'id': 'enkidu', player_id: "yanick" } ] } );

    battle.dispatch_action( 'play_turn', true );
    battle.dispatch_action( 'play_turn', true );

    console.log(battle.state.log);

    battle.persistor.flush();
});

// ⥼ cat here/persist\%3Apotato | transerialize -.json 'sub{ use JSON; $_ =
// from_json $_ for values %$_; $_ }' -.json | j




