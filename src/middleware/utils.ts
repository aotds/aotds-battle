// @format

import { Middleware } from 'redux';
import { Action, ActionCreator, MiddlewareAPI, Dispatch } from '../reducer/types';
import { isType } from 'ts-action';

export function mw_for<A extends Action = Action>(target: ActionCreator<A>, inner: Middleware<A>) {
    let mw = (api: MiddlewareAPI) => (next: Dispatch) => (action: A) =>
        isType(action, target) ? inner(api)(next)(action) : next(action);

    return mw;
}

export function mw_compose(mws: Middleware<any>[]): Middleware {
    return api => original_next => mws.reduceRight((next, mw) => mw(api)(next), original_next);
}
