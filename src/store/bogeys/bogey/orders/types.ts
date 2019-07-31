
export type WeaponOrdersState = {
  firecon_id: number | null;
  weapon_id: number;
};

export type NavOrdersState = {
  thrust?: number;
  turn?: number;
  bank?: number;
};

export type FireconOrdersState = {
  firecon_id: number;
  target_id: string | null;
};

export type OrdersState = {
  issued?: boolean | string;  // can be a timestamp
  navigation?: NavOrdersState;
  firecons?: FireconOrdersState[];
  weapons?: WeaponOrdersState[];
};
