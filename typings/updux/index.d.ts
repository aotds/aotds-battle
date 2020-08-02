import Updux from "./updux";
import { Dux, Dictionary, Selector, Mutation, AggDuxState, Action, Upreducer, UpduxMiddleware, DuxActions, DuxSelectors } from "./types";
import { Creator } from 'ts-action';
import { AnyAction, Store } from 'redux';
export { default as Updux } from "./updux";
export { UpduxConfig, DuxState } from "./types";
export { subEffects } from './buildMiddleware';
export * from './types';
export default Updux;
export declare const coduxes: <C extends Dux<unknown, unknown, unknown, unknown>, U extends [C, ...C[]]>(...coduxes: U) => {
    coduxes: U;
};
export declare const dux: <S = unknown, A = unknown, X = unknown, C extends Partial<{
    initial: unknown;
    subduxes: Dictionary<Dux<unknown, unknown, unknown, unknown>>;
    coduxes: Dux<unknown, unknown, unknown, unknown>[];
    actions: Dictionary<Creator & {
        type: string;
    }>;
    selectors: Dictionary<Selector<any>>;
    mutations: any;
    groomMutations: (m: Mutation<any, Action<string, any>>) => Mutation<any, Action<string, any>>;
    effects: any;
    subscriptions: Function[];
}> = {}>(config: C) => {
    createStore: (...args: any) => Store<AggDuxState<S, C>, AnyAction> & {
        actions: DuxActions<A, C>;
    };
    upreducer: Upreducer<S>;
    subduxes: Dictionary<Dux<unknown, unknown, unknown, unknown>>;
    coduxes: Dux<unknown, unknown, unknown, unknown>[];
    middleware: UpduxMiddleware<AggDuxState<S, C>, DuxSelectors<AggDuxState<S, C>, X, C>, Action<string, any>>;
    actions: DuxActions<A, C>;
    reducer: (state: S | undefined, action: Action<string, any>) => S;
    mutations: Dictionary<Mutation<S, Action<string, any>>>;
    initial: AggDuxState<S, C>;
    selectors: DuxSelectors<AggDuxState<S, C>, X, C>;
    subscriptions: any;
};
//# sourceMappingURL=index.d.ts.map