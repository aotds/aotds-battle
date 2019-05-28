import { NavigationState } from "./navigation/types";
import { OrdersState } from "./orders/types";
import { DriveState } from "./drive/types";
import { WeaponState } from "./weaponry/weapon/reducer";
import { FireconState } from "./weaponry/firecon/types";
import { StructureState } from "./structure/types";

export type BogeyStateShorthand = {
    id: string,
    navigation: NavigationState,
    orders: OrdersState,
    drive: DriveState,
    structure: StructureState,
    weaponry: {
        weapons?: WeaponState[],
        firecons?: FireconState[],
    }

};

export type BogeyState = {
    id: string,
    navigation: NavigationState,
    orders: OrdersState,
    drive: DriveState,
    structure: StructureState,
    weaponry: {
        weapons?: WeaponState[],
        firecons?: FireconState[],
    }

};
