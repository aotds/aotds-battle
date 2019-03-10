import Redactor from "../../../../reducer/redactor";
import { OrdersState } from "./types";
import { set_orders } from "../actions";
import { clear_orders } from "../../../actions/phases";

const redactor = new Redactor({} as OrdersState);

export const orders_reducer = redactor.asReducer;

redactor.for(set_orders, ({ payload: { orders } }) => () => ({
  ...orders,
  done: true
}));

redactor.for(clear_orders, () => () => ({}));
