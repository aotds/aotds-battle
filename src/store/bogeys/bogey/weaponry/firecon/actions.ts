import { FireconOrdersState } from "../../orders/types";
import { action } from "../../../../../actions";

export const bogey_execute_firecon_order = action(
  'BOGEY_EXECUTE_FIRECON_ORDER',
    (bogey_id: string, firecon_id: number, orders: FireconOrdersState) => ({
      bogey_id,
      firecon_id,
      orders,
    }),
);
