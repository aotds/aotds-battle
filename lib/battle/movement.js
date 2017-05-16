import _ from 'lodash'; 

import JsonSchemaValidator from '../json-schema-type-checking';
import schemas from './schema';

const { with_args, returns, with_context, with_return } = JsonSchemaValidator({
    schemas
});

export const gen_ship_movement = function( orders = {} ) {
    let { thrust, turn, bank } = orders;

    let engine_rating = this.engine_rating;

    let movement = {
        trajectory: [ [ 'POSITION', this.coords ] ],
        velocity: this.velocity || 0,
        coords: this.coords || [0,0],
        heading: this.heading || 0
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

        movement = move_bank(bank,movement);
    }


    if( turn ) {
        let thrust = [ _.floor(movement.velocity/2), _.ceil(movement.velocity/2) ];
        let t = [ _.floor(turn/2), _.ceil(turn/2) ];
        if ( turn < 0 ) { t = t.reverse() }

        _.zip( t, thrust ).forEach( m => {
                movement::move_rotate(m[0]);
                movement::move_thrust(m[1]);
        });
    }
    else {
        movement::move_thrust( movement.velocity );
    }

    movement.coords = round_coords( movement.coords );

    return movement;
}
::with_args({ items: [ schemas.orders, ] })
::with_return( 'movement' );

function round_coords ( coords ) {
    return coords.map( x => _.round( x, 2) );
}

const move_thrust = function (velocity) {
    let angle = (6 - this.heading ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( (x) => velocity * x )

    this.trajectory.push([ 'MOVE', delta ]);
    this.coords = _.zip( this.coords, delta ).map( _.sum );

    return this;
}
::with_return('movement')
::with_context('movement');

function move_bank(velocity,movement) {
    let angle = (6 - movement.heading -3  ) * Math.PI / 6;
    let delta = [ Math.sin(angle), Math.cos(angle) ].map( (x) => velocity * x )

    movement.trajectory.push([ 'MOVE', delta ]);
    movement.coords = _.zip( movement.coords, delta ).map( _.sum );

    return movement;
}

const move_rotate = function (angle=0) {
    this.trajectory.push(['ROTATE', angle] );
    this.heading +=  angle >= 0 ? angle : (12 + (angle%12));
    this.heading %= 12;

    return this;
}
::with_return( 'movement' )
::with_context( 'movement' )
