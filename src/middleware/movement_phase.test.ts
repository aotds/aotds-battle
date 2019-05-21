// @format

import { test_mw } from './test_fixtures';
import { move_bogeys } from './movement_phase';
import { move_bogey } from '../store/bogeys/bogey/navigation/actions';
import { bogey_movement } from '../actions/bogey';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';

const debug = require('debug')('aotds');
import _ from 'lodash';
import u from 'updeep';

jest.mock('../store/selectors');
const selectors = require('../store/selectors');

selectors.get_bogeys = jest.fn().mockReturnValue([{ id: 'enkidu' }, { id: 'siduri' }]);

selectors.get_bogey = jest.fn().mockReturnValueOnce(() => ({
    id: 'enkidu',
    navigation: {
        heading: 3,
        velocity: 0,
        coords: [0, 0],
    },
    orders: {
        navigation: {
            thrust: 3,
        },
    },
    drive: {
        current: 4,
    },
}));

selectors.get_bogey.mockReturnValueOnce(() => ({
    id: 'siduri',
    navigation: {
        coords: [0, 0],
    },
}));

function round_deep(thingy: any) {
    if (_.isObject(thingy)) {
        return u.map(round_deep, thingy);
    }

    if (!_.isNumber(thingy)) return thingy;

    return _.round(thingy, 1);
}

test('move_bogeys', () => {
    const dispatch = jest.fn();

    test_mw(move_bogeys, {
        dispatch,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(round_deep(dispatch.mock.calls[0][0])).toMatchObject({
        type: 'BOGEY_MOVEMENT',
        payload: {
            id: 'enkidu',
            navigation: {
                velocity: 3,
                thrust_used: 3,
                coords: [3, 0],
                trajectory: { 0: { type: 'POSITION', coords: [0, 0] } },
            },
        },
    });
});
