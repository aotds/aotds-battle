import Updux, { coduxes, dux, DuxState, Upreducer, Dictionary, Dux, UpduxMiddleware, Action, Mutation } from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';
import {UpdateReturnMap} from 'updeep/types/types';
import { action, empty, payload, FunctionWithParametersType } from 'ts-action';
import {Store, AnyAction} from 'redux';

import {
    WeaponState
} from './bogeys/bogey/weaponry/weapons';

import {
    FireconOrders
} from './bogeys/bogey/weaponry/firecons';

import { BogeyState } from './bogeys/bogey';
import { NavigationState } from './bogeys/bogey/navigation';
import { StructureState } from './bogeys/bogey/structure';
import { LogAction } from './log';


import { metaTimestampDux } from './metaTimestamp';
import actionId, { actionIdEffect } from './game/actionId';
import subactions from './subactions';
import playPhases from './playPhases';
import bogeys, { inflateBogeys } from './bogeys';
import log from './log';
import game from './game';
import { inflateFirecons } from './bogeys/bogey/weaponry/firecons';

type State = {
    game: {
        next_action_id: number;
    };
};

type GameInitPayload = {};

const init_game = action('init_game', payload<GameInitPayload>());

const battleDux = new Updux({
    initial: {} as State,
    ...coduxes(metaTimestampDux, playPhases),
    subduxes: {
        game,
        bogeys,
        log,
    },
    actions: { init_game },
    effects: [['*', actionIdEffect(state => state?.game?.next_action_id)]],
});

export function inflateBattle( shorthand: any ) {
    return u({
        bogeys: inflateBogeys
    }, shorthand)
}


battleDux.addMutation( init_game,
    initState => u(inflateBattle(initState)) );

export type BattleState = DuxState< typeof battleDux >;

export default battleDux.asDux;
