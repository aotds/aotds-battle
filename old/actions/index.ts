// @format

import { action as ts_action } from 'ts-action';

type PayloadAction<P extends (...args: any[]) => R, R extends object> = {
	payload: R;
};

type SimpleActionCreator<N extends string = string> = {
	type: N;
	(): { type: N };
};

type PayloadActionCreator<
	N extends string = string,
	A extends any[] = [],
	P extends any = any
> = {
	type: N;
	(...args: A): { type: N; payload: P };
};

export function action<N extends string>(
	name: N,
	payload?: undefined,
): SimpleActionCreator<N>;
export function action<N extends string, A extends any[], R extends object>(
	name: N,
	payload: (...args: A) => R,
): PayloadActionCreator<N, A, R>;
export function action(name: any, payload: any) {
	return payload
		? (ts_action(name, (...args) => ({
				payload: payload(...args),
		  })) as any)
		: ts_action(name);
}
