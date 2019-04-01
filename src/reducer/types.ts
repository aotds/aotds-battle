export type Action = { type: string };

export type Reducer<T, A extends Action = Action> = ( state: T|undefined, action: A ) => T;

export type Dispatch = <A extends Action>(action: A) => any;

export type MiddlewareAPI = {
    getState: () => any;
    dispatch: Dispatch;
};
export type ActionCreator<T extends Action = Action> = ( ( ...args: any[] ) => T ) & { type: string };

export type UpReducer<T, A extends Action = Action> =
    ( action: A ) => ( state: T ) => T;

export type CatchAll = '*';
