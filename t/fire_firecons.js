import tap from 'tap';
import _ from 'lodash';

import Battle from '../lib/battle';

import { rig_dice } from '../lib/battle/dice';

import logger from '../lib/Logger';
logger.level = 'debug';

import Action from '../lib/battle/Actions';

function test_log(tap,log,expected) {
    tap.test( 'test log', tap => {
        if ( ! [true].concat(expected).reduce( (a,b) => {
            return a && log.length ? tap.match( log.shift(), b, b.type ) : tap.match( {}, b, b.type );
        }) ) {
            logger.debug(  "remaining logs: ", log );
        };
        tap.end();
    });
}

tap.test( 'simple assign', tap => {

    let battle = new Battle({ 
        state: require( './samples/game_1.json' ) 
    });

    battle.dispatch( Action.firecon_weapon({
        object_id: 'enkidu',
        firecon_id: 0,
        weapon_id: 0,
    }));

    battle.dispatch( Action.firecon_target({
        object_id: 'enkidu',
        firecon_id: 0,
        target_id: 'siduri',
    }));

    rig_dice( 6, 6, 4 );

    battle.dispatch( Action.firecons_fire({
        object_id: 'enkidu',
    }) );

    logger.debug( "log:\n", battle.state );

    test_log( tap, battle.state.log, [
                { type: 'FIRECON_WEAPON', object_id: 'enkidu', weapon_id: 0, firecon_id: 0 },
                { type: 'FIRECON_TARGET', object_id: 'enkidu', target_id: 'siduri', firecon_id: 0 },
                { type: 'FIRECONS_FIRE', object_id: 'enkidu'  },
                { type: 'FIRECON_FIRE', firecon_id: 0, object_id: 'enkidu' },
                { type: 'WEAPON_FIRE', weapon_id: 0, object_id: 'enkidu', target_id: 'siduri' },
                { type: 'WEAPON_FIRED', weapon_id: 0, object_id: 'enkidu', target_id: 'siduri' },
                { type: 'DAMAGE', object_id: 'siduri', damage: 2 },
                { type: 'DAMAGE', object_id: 'siduri', damage: 3, is_penetrating: true },
        ] );

    tap.is(
        _.find(battle.state.objects, { id: 'siduri' }).hull, 7,
        "damage taken off the hull"
    );

    tap.end();

});

tap.test('destroying a ship', tap => {
    let battle = new Battle({ 
        state: require( './samples/game_1.json' ) 
    });

    battle.dispatch( Action.damage({
        object_id: 'siduri', damage: 20 }));

    let siduri = _.find(battle.state.objects, { id: 'siduri' });

    tap.is( siduri.hull, -8, "damage taken off the hull" );
    tap.ok( siduri.is_destroyed, "ship is destroyed" );

    tap.end();
});
