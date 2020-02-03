import { mw_subactions_for, subaction_dispatch } from "../../../../../../middleware/subactions";
import { BogeyState } from "../../../types";
import { InternalDamage, internal_damage, damage } from "../../../../../../actions/bogey";
import dice from "../../../../../../dice";
import _ from 'lodash';
import fp from 'lodash/fp';
import { get_bogey } from "../../../../../selectors";
import { oc } from 'ts-optchain';
import { mw_for } from "../../../../../../middleware/utils";

type InternalDamageResolver = (
  ship: BogeyState,
  percent: number
) => Iterator<InternalDamage>;

type InternalSystem = { type: string, id?: number }

type InternalCheck = (bogey: BogeyState ) => undefined | InternalSystem | InternalSystem[];

const internal_damage_drive : InternalCheck = function(bogey) {
  let drive = bogey.drive;

  if (!drive) return;

  let damage = drive.damage_level || 0;

  if (damage >= 2) return; // already kaput

  return  { type: 'drive' }
}

const internal_damage_firecons : InternalCheck = bogey  =>
    oc(bogey).weaponry.firecons([])
    .filter(f => !f.damaged)
    .map(f => f.id)
    .map((id: number) => ({type: 'firecon', id }));

const internal_damage_weapons : InternalCheck = bogey  =>
    oc(bogey).weaponry.weapons([])
    .filter(f => !f.damaged)
    .map(f => f.id)
    .map((id: number) => ({type: 'weapon', id }));

const internal_damage_shields : InternalCheck = (bogey: BogeyState)  =>
    oc(bogey).structure.shields([])
    .filter(f => !f.damaged)
    .map(f => f.id)
    .map((id: number) => ({type: 'shield', id }));


export default mw_for( damage, ({getState,dispatch})=>(next)=>(action: ReturnType<typeof damage>) => {

    const bogey_id = action.payload.bogey_id;

    let bogey = get_bogey( getState(), bogey_id );

    let before = bogey.structure.hull.current;

    next(action);

    dispatch = subaction_dispatch(action, dispatch);

    bogey = get_bogey( getState(), bogey_id );

    let delta = before - bogey.structure.hull.current;

            if( delta > 0 ) {
                const threshold = 100 * delta / ( fp.getOr(1)(['structure', 'hull', 'rating' ] )(bogey as any) as number );

                _.flattenDeep([
                    internal_damage_drive,
                    internal_damage_firecons,
                    internal_damage_weapons,
                    internal_damage_shields
                ].map( (x:any) => x(bogey,threshold) ) )
                .map(system => ({system, check: { threshold, die: dice(1,{ nbr_faces: 100, note: `internal damage check ${JSON.stringify(system)}` })[0]  }} ))
                .map( id => ({ hit: id.check.die <= id.check.threshold, ...id } ) )
                .filter( ({hit}) => hit ).map( id =>
                    internal_damage( bogey_id, id )
                ).map( x => dispatch(x) );
            }

});
