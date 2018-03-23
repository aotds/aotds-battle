import fp from 'lodash/fp';

let roll_die = () => rigged_dice.length > 0 
                        ? rigged_dice.shift() 
                        : fp.random(1,6);

export let rigged_dice = [];

export function cheatmode() {
    roll_die = () => { 
        if ( rigged_dice.length ) return rigged_dice.shift();
        throw new Error("not enough dice");
    };
}

/** 
 * Rig the next calls to roll_dice()
 * @param dice the dice values to return. Overwrite any previous rigging.
 */
export function rig_dice(dice) {
    rigged_dice = dice;
}

/**
 * roll the dice
 * @param nbr_dice How many dice to roll
 * @param options.reroll Array of values for which we reroll
 * @return dice values
 */
export function roll_dice( nbr_dice, options ) {

    if ( nbr_dice == 0 ) return [];

    let reroll_on = fp.pathOr( [] )('reroll' )(options);

    let roll = fp.times(roll_die)(nbr_dice);

    return roll.concat( 
        roll_dice(
            fp.filter( x => fp.contains(x)(reroll_on) )( roll ).length,
            options
        )
    );

};
