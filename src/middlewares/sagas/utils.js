import _ from 'lodash';

import { put } from 'redux-saga/effects';

import { push_action_stack, pop_action_stack } from '~/actions';

export function* subactions(action,inner) {
    let parent_id = _.get(action,'meta.id');

    if (parent_id) yield put( push_action_stack(parent_id) );

    yield* inner();

    if (parent_id) yield put( pop_action_stack() );
}
