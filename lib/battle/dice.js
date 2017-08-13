// @flow
import _ from 'lodash';

export let rigged_dice = [];

let gen_dice = () => rigged_dice.length > 0 
                        ? rigged_dice.shift() 
                        : _.random(1,6);

/** 
 * Rig the next calls to roll_dice()
 * @param dice the dice values to return. Overwrite any previous rigging.
 */
export function rig_dice(...dice :Array<number> ) {
    rigged_dice = dice;
}

/**
 * options for roll_dice
 */
type Options = {
    reroll?: Array<number>
};

/**
 * roll the dice
 * @param nbr_dice How many dice to roll
 * @param options.reroll Array of values for which we reroll
 * @return dice values
 */
export function roll_dice( nbr_dice: number, options: Options = {}  ) :Array<number> {

    if ( nbr_dice == 0 ) return [];

    let roll = _.times(nbr_dice, gen_dice );

    if(!options.reroll) options.reroll = [];

    let reroll = options.reroll|| [];

    return roll.concat( 
        roll_dice( roll.filter( n => reroll.indexOf(n) > -1 ).length, options )
    );
};
