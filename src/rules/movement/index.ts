import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { NavOrdersState } from '../../store/bogeys/bogey/orders/types';
import { BogeyState } from '../../store/bogeys/bogey/types';
import { NavigationState } from '../../store/bogeys/bogey/navigation/types';

import { oc } from 'ts-optchain';

const upush = ( new_item: any ) => ( state = [] ) => [ ...state, new_item ];

type BogeyMovement = Pick< BogeyState, 'navigation' | 'drive' | 'orders' >;

export function plot_movement( ship: BogeyMovement ) {
    let navigation = ship.navigation;
    let orders = oc( ship ).orders.navigation({});

    navigation = u({ trajectory: [
        { type: 'POSITION', coords: navigation.coords }
    ] })(navigation) as NavigationState;

    let { thrust, turn, bank } = orders;
    if(!thrust) thrust = 0;
    if(!turn) turn = 0;
    if(!bank) bank = 0;

    const engine_rating = fp.getOr(0)('drive.current')(ship as any);

    let engine_power = engine_rating;

    const thrust_range: [number, number] = [
         _.max([ -engine_power, -navigation.velocity]) as number, engine_power
     ];

    const clamp_thrust = ( t: number ): number => _.clamp( t, thrust_range[0], thrust_range[1] );

    if( thrust ) {
        thrust = clamp_thrust(thrust);
        let y = u({ velocity: ( v: number ) => v + ( thrust as number ) });
        navigation = ( u({ velocity: ( v: number ) => v + ( thrust as number ) })(navigation) ) as NavigationState;
        engine_power -= Math.abs(thrust);
    }

    if ( turn ) {
        const max: number = _.min([ _.floor(engine_rating/2), engine_power ]) as number;
        turn = _.clamp( turn, -max, max );
        engine_power -= Math.abs(turn);
    }

    if( bank ) {
        const max: number = _.min([ _.floor(engine_rating/2), engine_power ]) as number;
        bank = _.clamp( bank, -max, max );
        engine_power -= Math.abs(bank);

        navigation = move_bank(navigation,bank);
    }

    if( turn ) {
        const thr = two_steps(navigation.velocity);
        const t      = two_steps(turn);

        _.zip( t, thr ).forEach( m => {
                navigation = move_thrust( move_rotate(navigation, m[0] as number), m[1] as number );
        });
    }
    else {
        navigation = move_thrust( navigation, navigation.velocity );
    }

    // navigation = u({ trajectory: upush({
    //     type: 'POSITION', coords: navigation.coords
    // })})(navigation);

    const sym_range = ( x: number ) => [-x,x];
    const side_maneuver = ( current: number ): number[] =>
        sym_range( fp.min([ Math.abs(current) + engine_power, _.floor(engine_rating/2) ]) as number );

    const max_thrust = Math.abs(thrust) + engine_power;

    const maneuvers = {
        thrust: [ fp.max([ -max_thrust, -ship.navigation.velocity ]), max_thrust ],
        bank: side_maneuver(bank),
        turn: side_maneuver(turn),
    };

    let x = u({
        thrust_used: engine_rating - engine_power,
        maneuvers,
    })({});

    x = u({
        thrust_used: engine_rating - engine_power,
        maneuvers,
    }, {});

    navigation = u({
        thrust_used: engine_rating - engine_power,
        maneuvers,
    })(navigation) as NavigationState;


    return navigation;
}

const roundCoords = ( coords: [ number, number ] ) => coords.map( x => _.round(x,2) );

export
function move_thrust( navigation: NavigationState, thrust: number ): NavigationState {
    const angle = ( navigation.heading ) * Math.PI / 6;
    const delta = [ Math.sin(angle), Math.cos(angle) ].map( x => thrust * x );

    const coords = roundCoords( _.zip( navigation.coords, delta ).map( _.sum ) as any );

    return u.if(thrust, {
        trajectory: upush({ type: 'MOVE', delta, coords }),
        coords
    })(navigation) as NavigationState;
}

export
function move_bank( movement: NavigationState, velocity: number ): NavigationState {
    const angle = ( movement.heading +3  ) * Math.PI / 6;
    const delta = [ Math.sin(angle), Math.cos(angle) ].map( (x) => velocity * x );

    const coords = roundCoords( _.zip( movement.coords, delta ).map( _.sum ) as any );

    return u({
        trajectory: u.withDefault( [], upush({ type: 'BANK', delta, coords }) ),
        coords
    })(movement) as NavigationState;
}

/**
 * returns a heading between [0,12[
 */
function canonicalHeading(heading: number): number {
    heading %= 12;

    if( heading < 0 ) heading += 12;

    return heading;
}

export
function move_rotate( movement: NavigationState , angle: number ): NavigationState  {
    const heading = canonicalHeading( movement.heading + angle );

    return u({
        trajectory: upush({
            type: 'ROTATE', delta: angle, heading
        }),
        heading
    })( movement ) as NavigationState;
}

function two_steps(n: number): [ number, number ] {
    const split: [ number, number ] = [ _.floor(n/2), _.ceil(n/2) ];

    if ( n < 0 ) split.reverse();

    return split;
}

