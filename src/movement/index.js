import _ from 'lodash'; 
import u from 'updeep';

const debug = require('debug')('aotds:movement');

const upush =  new_item => array => [ ...array, new_item ];

import Actions from '../actions';

// let ObjectNavigation = {
//     engine_rating: 'integer',
//     velocity: 'number',
//     coords: Array[2]number
//     heading: number,
// }

// let ShipMovementOrder = {
//     thrust: 'integer',
//     turn: 'integer',
//     bank: 'integer',
// }

export function *plot_movement( ship, orders = {} ) {
    let navigation = ship.navigation;
    debug(ship);

    navigation = u({ trajectory: [
        { type: 'POSITION', coords: navigation.coords }
    ] })(navigation);

    navigation = move_thrust( navigation, navigation.velocity );

    yield Actions.move_object_store( ship.id, navigation );

    return;

    let { thrust, turn, bank } = orders;

    let engine_rating = _.get( ship, 'drive_rating', 0 );

    let movement = {
        trajectory: [ [ 'POSITION', ship.coords ] ],
        velocity: ship.velocity || 0,
        coords: ship.coords || [0,0],
        heading: ship.heading || 0
    };

    let engine_power = engine_rating;

    let thrust_range = [
         _.max([ -engine_power, -movement.velocity]), engine_power 
     ];

    let clamp_thrust = _.partial( _.clamp, _, ...thrust_range );

    if( thrust ) {
        thrust = clamp_thrust(thrust);
        movement.velocity += thrust;
        engine_power -= thrust;
    }

    if ( turn ) {
        let max = _.min([ _.floor(engine_rating/2), engine_power ]);
        turn = _.clamp( turn, -max, max );
        engine_power -= turn;
    }

    if( bank ) {
        let max = _.min([ _.floor(engine_rating/2), engine_power ]);
        bank = _.clamp( bank, -max, max );
        engine_power -= bank;

        movement = move_bank(movement,bank);
    }


    if( turn ) {
        let thrust = two_steps(movement.velocity);
        let t      = two_steps(turn);

        _.zip( t, thrust ).forEach( m => {
                movement = move_thrust( move_rotate(movement, m[0]), m[1] );
        });
    }
    else {
        movement = move_thrust( movement, movement.velocity );
    }

    return movement;
}

export
function move_thrust( navigation, thrust ) {
    let angle = ( navigation.heading ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( x => thrust * x )

    return u({
        trajectory: upush({ type: 'MOVE', delta }),
        coords:     _.zip( navigation.coords, delta ).map( _.sum )
    })(navigation);
};

export
function move_bank( movement, velocity ) {
    let angle = ( movement.heading +3  ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( (x) => velocity * x )

    return u({
        trajectory: u.withDefault( [], upush([ 'MOVE', delta ]) ),
        coords: _.zip( movement.coords, delta ).map( _.sum ),
    })(movement);
}


export
function move_rotate( movement , angle =0)  {
    return u({ 
        trajectory: u.withDefault( [], upush(['ROTATE', angle]) ),
        heading: heading => {
            heading +=  angle >= 0 ? angle : (12 + (angle%12));
            heading %= 12;
            return heading;
        }
    })( movement );
}

function two_steps(n  ) {
    let splitted = [ _.floor(n/2), _.ceil(n/2) ];
    return n < 0 ? splitted.reverse() : splitted;
}

