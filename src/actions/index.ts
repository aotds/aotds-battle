// @format

import { action as ts_action } from 'ts-action';

type PayloadAction<P extends (...args: any[]) => R, R extends object> = {
    payload: R;
};

export function action<N extends string>(name: N, payload?: undefined): () => { type: N };
export function action<N extends string, A extends any[], R extends object>(
    name: N,
    payload: (...args: A) => R,
): (...args: A) => { type: N; payload: R };
export function action(name: any, payload: any) {
    return payload
        ? (ts_action(name, (...args) => ({
              payload: payload(...args),
          })) as any)
        : ts_action(name);
}
