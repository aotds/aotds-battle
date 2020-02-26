
export type WeaponOrdersState = {
  firecon_id: number | null;
};

export type NavOrdersState = {
  thrust?: number;
  turn?: number;
  bank?: number;
};

export type FireconOrdersState = {
  target_id: string | null;
};

export type OrdersState = {
  issued?: boolean | string;  // can be a timestamp
  navigation?: NavOrdersState;
  firecons?: { [firecon_id: number]: FireconOrdersState };
  weapons?: { [weapon_id: number]: WeaponOrdersState };
};
