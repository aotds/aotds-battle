import Updux from '.';
declare const updux: Updux<unknown, null, unknown, {
    subduxes: {
        foo: {
            createStore: (...args: any) => import("redux").Store<string, import("redux").AnyAction> & {
                actions: {};
            };
            upreducer: import("./types").Upreducer<unknown>;
            subduxes: import("./types").Dictionary<import("./types").Dux<unknown, unknown, unknown, unknown>>;
            coduxes: import("./types").Dux<unknown, unknown, unknown, unknown>[];
            middleware: import("./types").UpduxMiddleware<string, {}, import("./types").Action<string, any>>;
            actions: {};
            reducer: (state: unknown, action: import("./types").Action<string, any>) => unknown;
            mutations: import("./types").Dictionary<import("./types").Mutation<unknown, import("./types").Action<string, any>>>;
            initial: string;
            selectors: {};
            subscriptions: any;
        };
    };
}>;
export default updux;
//# sourceMappingURL=middleware_aux.d.ts.map