import tap from 'tap';

import __ from 'lodash/fp';

import Battle from 'Game/Battle';


import { rig_dice } from 'Game/Dice';

import Logger from 'Game/Logger';
let logger = Logger();

function test_log(tap,log,expected) {
    tap.test( 'test log', tap => {
        if ( ! [true].concat(expected).reduce( (a,b) => {
            return a && log.length ? tap.match( log.shift(), b ) : tap.match( {}, b, "log empty" );
        }) ) {
            logger.debug(  "remaining logs: ", log );
        };
        tap.end();
    });
}

tap.test( 'simple assign', tap => {

    let battle = Battle({ 
        state: require( './samples/game_1.json' ) 
    });

    battle.dispatch('firecon_target', [ 'enkidu', 0, 'siduri' ] );

    rig_dice( 6, 6, 4 );

    battle.dispatch('firecon_fire', 'enkidu');

    logger.debug( "log:\n", JSON.stringify( battle.state.log ) );

    test_log( tap, battle.state.log, [
                { type: 'FIRECON_TARGET', object_id: 'enkidu', target_id: 'siduri', firecon_id: 0 },
                { type: 'FIRECONS_FIRE', object_id: 'enkidu'  },
                { type: 'FIRECON_FIRE', firecon_id: 0, object_id: 'enkidu' },
                { type: 'WEAPON_FIRE', weapon_id: 0, object_id: 'enkidu', target_id: 'siduri' },
                { type: 'DAMAGE', object_id: 'siduri', damage: 2 },
                { type: 'PENETRATING_DAMAGE', object_id: 'siduri', damage: 3 },
        ] );

    tap.is(
        _.find(battle.state.objects, { id: 'siduri' }).hull, 7,
        "damage taken off the hull"
    );

    tap.end();

});

tap.test('destroying a ship', tap => {
    let battle = new Battle({ 
        store: require( './samples/game_1.json' ) 
    });

    battle.actions.dispatch_penetrating_damage( 'siduri', 20 );

    let siduri = _.find(battle.state.objects, { id: 'siduri' });

    tap.is( siduri.hull, -8, "damage taken off the hull" );
    tap.ok( siduri.is_destroyed, "ship is destroyed" );

    tap.end();
});
