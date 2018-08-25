import fp from 'lodash/fp';
import u from 'updeep';

import { roll_dice, cheatmode } from '../dice';

const debug = require('debug')('aotds:test');

cheatmode();

const rad2angle = rad => rad * 6 / Math.PI;

const canonize_angle = angle => {
    while( angle > 6 ) { angle -= 12; }
    while( angle <= -6 ) { angle += 12; }
    return angle;
};


export
function relative_coords(ship, target ) {
    let result = {};
    let relative = fp.pipe([
        fp.map(fp.get('navigation.coords')),
        fp.zipAll,
        fp.map( x => x[1]-x[0] )
    ])([ship,target]);

    result.angle = rad2angle( Math.atan2(relative[0], relative[1]) );

    result.bearing = result.angle - ship.navigation.heading;

    result.target_angle = 6 + result.angle;

    result.target_bearing = result.target_angle - target.navigation.heading;

    result = u({ 
        angle:          canonize_angle,
        bearing:        canonize_angle,
        target_bearing: canonize_angle,
        target_angle:   canonize_angle,
        distance:       Math.sqrt(
            fp.sum( relative.map(function (x) { return Math.pow(x, 2); }) )
        )
    })(result);

    return result;
}

const arc_range = {
    F:  [[ -1, 1 ]],
    FS: [[ 1, 3 ]],
    AS: [[ 3, 5 ]],
    A:  [[ 5, 6], [-6,-5]],
    AP: [[ -5, -3 ]],
    FP: [[ -3, -1 ]],
};

const in_range = (min,max) => value => {
    return ( value >= min ) && (value <= max );
}

function inArc( angle, arcs = Object.keys(arc_range) ){
    return arcs.find( a => arc_range[a].some( r => in_range(...r)(angle) ) )
}

export function fire_weapon( attacker, target, weapon ) {
    let result = { weapon };

    debug(attacker,target,weapon);

    if( !target ) {
        return result |> u({ aborted: 'no target' });
    }

    if( !weapon ) {
        return result |> u({ aborted: 'no weapon' });
    }


    result = u(relative_coords(attacker, target))(result);

    if(!inArc(result.bearing, fp.getOr([],'arcs')(weapon) )) {
        return u({ no_firing_arc: true })(result);
    }

    if( inArc(result.bearing,['A']) && fp.get('drive.thrust_used')(attacker) ) {
        return u({ drive_interference: true })(result);
    }

    var nbr_dice = weapon.class - Math.trunc( result.distance / 12);

    if (nbr_dice <= 0) {
        return u({ out_of_range: true })(result);
    }

    let damage_dice = [];
    let penetrating_damage_dice = [];

    damage_dice = roll_dice(nbr_dice);
    penetrating_damage_dice = roll_dice( damage_dice.filter( x => x == 6 ).length, { reroll: [ 6] } );

    if( inArc( result.target_bearing, [ 'A' ] ) ) {
        penetrating_damage_dice.unshift( ...damage_dice );
        damage_dice = [];
    }

    result = u(fp.pickBy( v => v.length )({ damage_dice, penetrating_damage_dice }))(result);

    return result;

}



//     // split the damage calculation apart?

//     var table = { 4: 1, 5: 1, 6: 2 };
//     var damage = _.sum(dice.map(function (d) { return table[d] || 0; }));
//     if (damage > 0) {
//         yield {
//             type: 'DAMAGE',
//             object_id: target.id,
//             damage
//         };
//     }
//     damage = _.sum(penetrating.map(function (d) { return table[d] || 0; }));
//     if (damage > 0) {
//         yield {
//             type: 'DAMAGE',
//             is_penetrating: true,
//             object_id: target.id,
//             damage
//         };
//     }
// }
