import { ActionCreator, ActionType } from 'ts-action';
import { AnyAction } from 'redux';
import { UpduxConfig, Dictionary, Action, Mutation, Upreducer, UpduxMiddleware, Selector, Dux, UnionToIntersection, AggDuxState, DuxSelectors, DuxActions } from './types';
import { Store } from 'redux';
declare type ActionsOf<U> = U extends Updux ? U['actions'] : {};
export declare type UpduxActions<U> = U extends Updux ? UnionToIntersection<UpduxLocalActions<U> | ActionsOf<CoduxesOf<U>[keyof CoduxesOf<U>]>> : {};
export declare type UpduxLocalActions<S> = S extends Updux<any, null> ? {} : S extends Updux<any, infer A> ? A : {};
export declare type CoduxesOf<U> = U extends Updux<any, any, any, infer S> ? S : [];
/**
 *  @public
 * `Updux` is a way to minimize and simplify the boilerplate associated with the
 * creation of a `Redux` store. It takes a shorthand configuration
 * object, and generates the appropriate reducer, actions, middleware, etc.
 * In true `Redux`-like fashion, upduxes can be made of sub-upduxes (`subduxes` for short) for different slices of the root state.
 */
export declare class Updux<S = unknown, A = null, X = unknown, C extends UpduxConfig = {}> {
    subduxes: Dictionary<Dux>;
    coduxes: Dux[];
    private localSelectors;
    private localInitial;
    groomMutations: (mutation: Mutation<S>) => Mutation<S>;
    private localEffects;
    private localActions;
    private localMutations;
    private localSubscriptions;
    get initial(): AggDuxState<S, C>;
    /**
     * @param config an [[UpduxConfig]] plain object
     *
     */
    constructor(config?: C);
    /**
     * Array of middlewares aggregating all the effects defined in the
     * updux and its subduxes. Effects of the updux itself are
     * done before the subduxes effects.
     * Note that `getState` will always return the state of the
     * local updux.
     *
     * @example
     *
     * ```
     * const middleware = updux.middleware;
     * ```
     */
    get middleware(): UpduxMiddleware<AggDuxState<S, C>, DuxSelectors<AggDuxState<S, C>, X, C>>;
    /**
     * Action creators for all actions defined or used in the actions, mutations, effects and subduxes
     * of the updux config.
     *
     * Non-custom action creators defined in `actions` have the signature `(payload={},meta={}) => ({type,
     * payload,meta})` (with the extra sugar that if `meta` or `payload` are not
     * specified, that key won't be present in the produced action).
     *
     * The same action creator can be included
     * in multiple subduxes. However, if two different creators
     * are included for the same action, an error will be thrown.
     *
     * @example
     *
     * ```
     * const actions = updux.actions;
     * ```
     */
    get actions(): DuxActions<A, C>;
    get upreducer(): Upreducer<S>;
    /**
     * A Redux reducer generated using the computed initial state and
     * mutations.
     */
    get reducer(): (state: S | undefined, action: Action) => S;
    /**
     * Merge of the updux and subduxes mutations. If an action triggers
     * mutations in both the main updux and its subduxes, the subduxes
     * mutations will be performed first.
     */
    get mutations(): Dictionary<Mutation<S>>;
    /**
     * Returns the upreducer made of the merge of all sudbuxes reducers, without
     * the local mutations. Useful, for example, for sink mutations.
     *
     * @example
     *
     * ```
     * import todo from './todo'; // updux for a single todo
     * import Updux from 'updux';
     * import u from 'updeep';
     *
     * const todos = new Updux({ initial: [], subduxes: { '*': todo } });
     * todos.addMutation(
     *     todo.actions.done,
     *     ({todo_id},action) => u.map( u.if( u.is('id',todo_id) ), todos.subduxUpreducer(action) )
     *     true
     * );
     * ```
     *
     *
     *
     */
    get subduxUpreducer(): Upreducer<AggDuxState<S, C>>;
    /**
     * Returns a `createStore` function that takes two argument:
     * `initial` and `injectEnhancer`. `initial` is a custom
     * initial state for the store, and `injectEnhancer` is a function
     * taking in the middleware built by the updux object and allowing
     * you to wrap it in any enhancer you want.
     *
     * @example
     *
     * ```
     * const createStore = updux.createStore;
     *
     * const store = createStore(initial);
     * ```
     *
     *
     *
     */
    createStore(...args: any): Store<AggDuxState<S, C>, AnyAction> & {
        actions: DuxActions<A, C>;
    };
    /**
     * Returns an array of all subscription functions registered for the dux.
     * Subdux subscriptions are wrapped such that they are getting their
     * local state. Also all subscriptions are further wrapped such that
     * they are only called when the local state changed
     */
    get subscriptions(): any;
    /**
     * Returns a <a href="https://github.com/erikras/ducks-modular-redux">ducks</a>-like
     * plain object holding the reducer from the Updux object and all
     * its trimmings.
     *
     * @example
     *
     * ```
     * const {
     *     createStore,
     *     upreducer,
     *     subduxes,
     *     coduxes,
     *     middleware,
     *     actions,
     *     reducer,
     *     mutations,
     *     initial,
     *     selectors,
     *     subscriptions,
     * } = myUpdux.asDux;
     * ```
     *
     *
     *
     *
     */
    get asDux(): {
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
    /**
     * Adds a mutation and its associated action to the updux.
     *
     * @param isSink - If `true`, disables the subduxes mutations for this action. To
     * conditionally run the subduxes mutations, check out [[subduxUpreducer]]. Defaults to `false`.
     *
     * @remarks
     *
     * If a local mutation was already associated to the action,
     * it will be replaced by the new one.
     *
     *
     * @example
     *
     * ```js
     * updux.addMutation(
     *     action('ADD', payload<int>() ),
     *     inc => state => state + in
     * );
     * ```
     */
    addMutation<A extends ActionCreator>(creator: A, mutation: Mutation<S, ActionType<A>>, isSink?: boolean): any;
    addMutation<A extends ActionCreator = any>(creator: string, mutation: Mutation<S, any>, isSink?: boolean): any;
    addEffect<AC extends ActionCreator>(creator: AC, middleware: UpduxMiddleware<AggDuxState<S, C>, DuxSelectors<AggDuxState<S, C>, X, C>, ReturnType<AC>>, isGenerator?: boolean): any;
    addEffect(creator: string, middleware: UpduxMiddleware<AggDuxState<S, C>, DuxSelectors<AggDuxState<S, C>, X, C>>, isGenerator?: boolean): any;
    /**
     * Adds an action to the updux. It can take an already defined action
     * creator, or any arguments that can be passed to `actionCreator`.
     * @example
     * ```
     *     const action = updux.addAction( name, ...creatorArgs );
     *     const action = updux.addAction( otherActionCreator );
     * ```
     * @example
     * ```
     * import {actionCreator, Updux} from 'updux';
     *
     * const updux = new Updux();
     *
     * const foo = updux.addAction('foo');
     * const bar = updux.addAction( 'bar', (x) => ({stuff: x+1}) );
     *
     * const baz = actionCreator( 'baz' );
     *
     * foo({ a: 1});  // => { type: 'foo', payload: { a: 1 } }
     * bar(2);        // => { type: 'bar', payload: { stuff: 3 } }
     * baz();         // => { type: 'baz', payload: undefined }
     * ```
     */
    addAction(theaction: string, transform?: any): ActionCreator<string, any>;
    addAction(theaction: string | ActionCreator<any>, transform?: never): ActionCreator<string, any>;
    get _middlewareEntries(): any[];
    addSelector(name: string, selector: Selector): void;
    /**
A dictionary of the updux's selectors. Subduxes'
selectors are included as well (with the mapping to the
sub-state already taken care of you).
     */
    get selectors(): DuxSelectors<AggDuxState<S, C>, X, C>;
    /**
     * Add a subscription to the dux.
     */
    addSubscription(subscription: Function): void;
}
export default Updux;
//# sourceMappingURL=updux.d.ts.map