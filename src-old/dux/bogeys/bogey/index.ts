import u from 'updeep';
import _ from 'lodash';
import fp from 'lodash/fp';
import { Updux } from 'updux';

import { dux as orders } from './orders';

import { inflate as inflateDrive } from './drive';
import { dux as weaponry, inflate as inflateWeaponry } from './weaponry';
import { inflate as inflateStructure } from './structure';
/*
import { DuxState } from 'updux';
import Updux from '../../../BattleUpdux';
import * as actions from './actions';
import * as drive from './drive';
import navigation from './navigation';
import structure, { inflate as inflate_structure } from './structure';
import weaponry, { inflate as inflate_weaponry } from './weaponry';
*/

export const dux = new Updux({
    initial: {},
    actions: {
        // ...actions,
        fireconOrdersPhase: null,
        weaponOrdersPhase: null,
    },
    subduxes: {
        // structure,
        orders,
        // navigation,
        weaponry,
        // drive,
    },
    selectors: {
        // getWeapon: bogey => id => _.find(_.get(bogey, 'weaponry.weapons', []), { id }),
        // getShieldLevel: bogey => {
        //     return Math.max(...bogey.weaponry.shields.filter(shield => !shield.damaged).map(({ level }) => level)) ?? 0;
        // },
    },
});

dux.setMutation(
    'setOrders',
    ({ bogeyId: id }, action) => u.if(fp.matches({ id }), u({ orders: orders.upreducer(action) })) as any,
);

dux.setMutation('fireconOrdersPhase', () => bogey => {
    const orders = bogey?.orders?.firecons ?? [];

    return u.updateIn('weaponry.firecons', orders, bogey);
});

dux.setMutation('weaponOrdersPhase', () => bogey => {
    const orders = bogey?.orders?.weapons ?? [];

    return u.updateIn('weaponry.weapons', orders, bogey);
});

/*
export type BogeyState = DuxState<typeof bogey_dux>;

bogey_dux.addMutation(
    bogey_dux.actions.bogey_movement_res,
    (({ bogey_id: id }, action) => u.if(fp.matches({ id }), u({ navigation: navigation.upreducer(action) }))) as any,
    true,
);




*/

export const inflate = u({
    weaponry: inflateWeaponry,
    structure: inflateStructure,
    drive: inflateDrive,
});
