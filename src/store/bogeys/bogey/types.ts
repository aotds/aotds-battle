import { NavigationState } from "./navigation/types";
import { OrdersState } from "./orders/types";
import { DriveState } from "./drive/types";
import { WeaponState } from "./weaponry/weapon/reducer";
import { FireconState } from "./weaponry/firecon/types";

export type BogeyState = {
    id: string,
    navigation: NavigationState,
    orders: OrdersState,
    drive: DriveState,
    weaponry: {
        weapons?: WeaponState[],
        firecons?: FireconState[],
    }

};
