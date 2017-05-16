import _ from 'lodash';

let gen_dice = () => rigged_dice.length > 0 ? rigged_dice.shift() : _.random(1,6);

export let rigged_dice = [];
export function rig_dice(results) {
    rigged_dice = results;
}

export function roll_dice( nbr_dice, options = {} ) {

    if ( nbr_dice == 0 ) return [];

    let roll = _.times(nbr_dice, gen_dice );

    if(! options.reroll ) return roll;

    return roll.concat( 
            roll_dice( roll.filter( n => options.reroll.indexOf(n) > -1 ).length, options )
    );
};
