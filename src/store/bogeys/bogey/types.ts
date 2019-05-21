import { NavigationState } from "./navigation/types";
import { OrdersState } from "./orders/types";
import { DriveState } from "./drive/types";

export type BogeyState = {
    id: string,
    navigation: NavigationState,
    orders: OrdersState,
    drive: DriveState,
};
