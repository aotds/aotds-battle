import _ from 'lodash'; 
import u from 'updeep';

const upush =  new_item => array => [ ...array, new_item ];

export const plot_movement = function( orders = {} ) {

    let ship = this;

    let { thrust, turn, bank } = orders;

    let engine_rating = ship.engine_rating || 0;

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
function move_thrust( movement, thrust ) {
    let angle = ( movement.heading ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( (x) => thrust * x )

    return u({
        trajectory: u.withDefault( [], upush([ 'MOVE', delta ]) ),
        coords:     _.zip( movement.coords, delta ).map( _.sum )
    })(movement);
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

