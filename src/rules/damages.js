import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';


const ship_max_shield = _.flow(
    fp.getOr({})( 'structure.shields'),
    fp.values,
    fp.map( 'level' ),
    fp.max
);


export const calculate_damage = function({ bogey, penetrating, dice }) {
    let damage_table = { 4: 1, 5: 1, 6: 2 };

    if( !penetrating ) {
        let shield = ship_max_shield(bogey);

        console.log(shield);

        damage_table = fp.pipe(
            u.if(shield,{ 4: 0 }),
            u.if(shield==2,{ 6: 1 }),
        )(damage_table);
    }

    return dice.map( d => damage_table[d] || 0 ) |> fp.sum
}
