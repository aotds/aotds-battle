import { Arc } from '../../../rules/fireWeapon/inArcs.js';
import u from 'updeep';
import { BDux } from '../../../../../BDux.js';

type Weapon = {
	id: number;
	weaponClass: 1 | 2 | 3;
	weaponType: 'beam';
};

type Mounted = {
	arcs: Arc[];
};

export type WeaponMounted = Weapon & Mounted;

export const dux = new BDux({
	initial: {} as Record<string, WeaponMounted>,
	actions: {
		bogeyWeaponsOrders: (bogeyId: string, orders) => ({ bogeyId, orders }),
	},
	subduxes: {},
});

export default dux;

dux.setMutation('bogeyWeaponsOrders', ({ orders }) => u(orders));

dux.setInflator((shorthand) => {
	if (!Array.isArray(shorthand)) return shorthand;

	return Object.fromEntries(
		shorthand.map((obj = {}, id) => [id + 1, { ...obj, id: id + 1 }]),
	);
});
