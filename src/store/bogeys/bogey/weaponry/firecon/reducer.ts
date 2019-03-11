import u from "updeep";
import Redactor from "../../../../../reducer/redactor";
import { FireconState } from "./types";
import { internal_damage } from "../../actions";
import { bogey_execute_firecon_order } from "./actions";

const redactor = new Redactor({ id: -1 } as FireconState);
export const firecon_reducer = redactor.asReducer;

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
  bogey_execute_firecon_order,
  ({
    payload: {
      orders: { target_id }
    }
  }) => u.ifElse(  target_id !== null, { target_id }, u.omit( ['target_id'] ) )
);

