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


import { metaTimestampDux } from './metaTimestamp';
import subactions from './subactions';
import playPhases from './playPhases';
import bogeys from './bogeys';
import log from './log';
import game from './game';

type State = {
    game: {
        next_action_id: number;
    };
};


const battleDux = new Updux({
    initial: {} as State,
    ...coduxes(metaTimestampDux, playPhases),
    subduxes: {
        game,
        bogeys,
        log,
    },
});

export type BattleState = typeof battleDux.initial;

export default battleDux.asDux;


