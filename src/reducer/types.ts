export type Action = { type: string };

export type Reducer<T, A extends Action = Action> = ( state: T|undefined, action: A ) => T;

export type ActionCreator<T extends Action = Action> = ( ( ...args: unknown[] ) => T ) & { type: string };

export type UpReducer<T, A extends Action = Action> =
    ( action: A ) => ( state: T ) => T;

export type CatchAll = '*';
