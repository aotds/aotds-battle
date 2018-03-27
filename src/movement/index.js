import _ from 'lodash'; 
import fp from 'lodash/fp'; 
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

export function plot_movement( ship, orders = {} ) {
    let navigation = ship.navigation;

    navigation = u({ trajectory: [
        { type: 'POSITION', coords: navigation.coords }
    ] })(navigation);

//    navigation = move_thrust( navigation, navigation.velocity );

    let { thrust, turn, bank } = orders;

    let engine_rating = fp.getOr(0)('drive.current')(ship);

    let engine_power = engine_rating;

    let thrust_range = [
         _.max([ -engine_power, -navigation.velocity]), engine_power 
     ];

    let clamp_thrust = thrust => _.clamp( thrust, ...thrust_range );

    if( thrust ) {
        thrust = clamp_thrust(thrust);
        navigation = u({ velocity: v => v + thrust })(navigation);
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

        navigation = move_bank(navigation,bank);
    }


    if( turn ) {
        let thrust = two_steps(navigation.velocity);
        let t      = two_steps(turn);

        _.zip( t, thrust ).forEach( m => {
                navigation = move_thrust( move_rotate(navigation, m[0]), m[1] );
        });
    }
    else {
        navigation = move_thrust( navigation, navigation.velocity );
    }

    navigation = u({ thrust_used: engine_rating - engine_power })(navigation);

    // navigation = u({ trajectory: upush({ 
    //     type: 'POSITION', coords: navigation.coords 
    // })})(navigation);

    return { navigation };
}

export
function move_thrust( navigation, thrust ) {
    let angle = ( navigation.heading ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( x => thrust * x )

    let coords = _.zip( navigation.coords, delta ).map( _.sum ); 

    return u.if(thrust, {
        trajectory: upush({ type: 'MOVE', delta, coords }),
        coords
    })(navigation);
};

export
function move_bank( movement, velocity ) {
    let angle = ( movement.heading +3  ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( (x) => velocity * x )

    let coords = _.zip( movement.coords, delta ).map( _.sum ); 

    return u({
        trajectory: u.withDefault( [], upush({ type: 'BANK', delta, coords }) ),
        coords 
    })(movement);
}

function canonicalHeading(heading) {
    while( heading < 0 ) {
        heading += 12;
    }
    return heading % 12;
}

export
function move_rotate( movement , angle )  {
    let heading = canonicalHeading( movement.heading + angle );

    return u({ 
        trajectory: u.withDefault( [], upush({ 
            type: 'ROTATE', delta: angle, heading
        }) ),
        heading
    })( movement );
}

function two_steps(n  ) {
    let splitted = [ _.floor(n/2), _.ceil(n/2) ];
    return n < 0 ? splitted.reverse() : splitted;
}

