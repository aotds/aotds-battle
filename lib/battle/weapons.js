import _ from 'lodash';

import { roll_dice } from './dice';

import JsonSchemaValidator from '../json-schema-type-checking';
import schemas from './schema';
import Action from './Actions';

const { with_args, returns, with_context, with_return } = JsonSchemaValidator({
    schemas
});

export
function relative_coords(ship, target ) {
    let result = {};
    let relative = _.zip
        .apply(null, [ship, target].map(function (s) { return s.coords; }))
        .map(function (x) { return x[1] - x[0]; });

    result.angle = Math.atan2(relative[0], relative[1])
        * 180 / Math.PI;

    result.bearing = result.angle - ship.heading;

    result.distance = Math.sqrt(relative.map(function (x) { return Math.pow(x, 2); })
        .reduce(function (a, b) { return a + b; }));

    result.angle = _.round( result.angle, 0 );
    result.bearing = _.round( result.bearing, 0 );
    result.distance = _.round( result.distance, 2 );

    return result;
}

const arcs = {
    F:  [ -30, 30 ],
    FP: [ -90, -30 ],
    FS: [ 30, 90 ],
    AS: [ 90, 150 ],
    A:  [ -150, 150 ],
    AF: [ -150, -90 ],
};

export const weapon_fire = function (attacker, target, weapon) {
    // right now it's all beam weapons
    var weapon_fired = Action.weapon_fired({
        object_id: attacker.id,
        target_id: target.id,
        weapon_id: weapon.id,
    });
    var actions = [weapon_fired];

    let { distance, bearing } = relative_coords(attacker, target);

    weapon_fired.distance = distance;
    weapon_fired.bearing = bearing;

    let in_weapon_arc = bearing => 
        weapon.arcs.map( x => arcs[x] )
            .some( arc => _.inRange( bearing, ...arc ) );

    if( ! in_weapon_arc( bearing ) ) {
        weapon_fired.no_firing_arc = true;
        return actions;
    }

    var nbr_dice = weapon.class - Math.trunc(distance / 12);

    if (nbr_dice <= 0) {
        weapon_fired.out_of_range = true;
        return actions;
    }

    var dice = roll_dice(nbr_dice);

    var penetrating = roll_dice(dice.filter(function (d) { return d == 6; }).length, { reroll: [6] });

    weapon_fired.dice = dice;

    weapon_fired.dice_penetrating = penetrating;

    // split the damage calculation apart?

    var table = { 4: 1, 5: 1, 6: 2 };
    var damage = _.sum(dice.map(function (d) { return table[d] || 0; }));
    if (damage > 0) {
        actions.push({
            type: 'DAMAGE',
            object_id: target.id,
            damage
        });
    }
    damage = _.sum(penetrating.map(function (d) { return table[d] || 0; }));
    if (damage > 0) {
        actions.push({
            type: 'DAMAGE',
            is_penetrating: true,
            object_id: target.id,
            damage
        });
    }
    return actions;
}
::with_return({
    type: 'array',
    items: { oneOf: [
        { '$ref': '/action/weapon_fired' },
        { '$ref': '/action/damage' },
    ]}
});
