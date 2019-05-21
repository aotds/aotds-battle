import u from "updeep";
import Redactor from "../../../../../reducer/redactor";
import { FireconState } from "./types";
import { internal_damage } from "../../actions";
import { bogey_firecon_orders } from "../../../../../actions/bogey";

const redactor = new Redactor({ id: -1 } as FireconState,undefined,'aotds:reducer:bogeys:bogey:weaponry:firecons:firecon');
export const firecon_reducer = redactor.asReducer;
export const firecon_upreducer = redactor.asUpReducer;

redactor.addRedaction(
  internal_damage,
  ({ payload: { hit, system } }) =>
    u.if(
      (f: FireconState) =>
        hit && system.type === "firecon" && system.id === f.id,
      {
        damaged: true
      }
    ) as any
);

redactor.addRedaction(
  bogey_firecon_orders,
  ({
    payload: {
      orders: { target_id }
    }
  }) => u({target_id})
);

