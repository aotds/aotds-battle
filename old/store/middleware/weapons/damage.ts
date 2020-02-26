import { mw_for } from "../../../middleware/utils";
import { fire_weapon_outcome, damage } from "../../../actions/bogey";
import { get_bogey } from "../../selectors";
import { mw_subactions_for } from "../../../middleware/subactions";

const rules = require( '../../../rules/weapons' );

export default mw_subactions_for( fire_weapon_outcome,
  ({getState,dispatch}) => next => action => {
        const { payload: { target_id, damage_dice = [], penetrating_damage_dice = [] } } = action;

    let target = get_bogey( getState(), target_id );

    if(damage_dice.length > 0 ) {
        const result = rules.weapon_damage( target, damage_dice, false );
        dispatch( damage( target.id, result.damage, result.is_penetrating ) );
    }

    if(penetrating_damage_dice.length > 0 ) {
        const result = rules.weapon_damage( target, penetrating_damage_dice, true );
        dispatch( damage( target.id, result.damage, result.is_penetrating ) );
    }
});
