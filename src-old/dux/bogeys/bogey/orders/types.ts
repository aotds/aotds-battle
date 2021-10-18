type FireconOrders = {
    firecon_id: number;
    target_id: string | null;
};

export type Orders = {
    navigation?: {
        thrust?: number;
        turn?: number;
        bank?: number;
    };
    firecons?: Array<FireconOrders>;
    weapons?: Array<{
        weapon_id: number;
        firecon_id: number;
    }>;
};

export type OrdersState = Orders & {
    done?: boolean | string; // can be the timestamp of when it was sent
};
