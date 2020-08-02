import { Middleware, Reducer, Store } from 'redux';
declare function buildCreateStore<S, A = {}>(reducer: Reducer<S>, middleware: Middleware, actions?: A): (initial?: S, injectEnhancer?: Function) => Store<S> & {
    actions: A;
};
export default buildCreateStore;
//# sourceMappingURL=index.d.ts.map