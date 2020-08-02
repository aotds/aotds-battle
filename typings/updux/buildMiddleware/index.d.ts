import { Dictionary, UpduxMiddleware, Selector } from '../types';
declare type Submws = Dictionary<UpduxMiddleware>;
declare type MwGen = () => UpduxMiddleware;
export declare type Effect = [string, UpduxMiddleware | MwGen, boolean?];
export declare const subMiddleware: () => (next: any) => (action: any) => any;
export declare const subEffects: Effect;
export declare const effectToMw: (effect: Effect, actions: Dictionary<import("ts-action").Creator & {
    type: string;
}>, selectors: Dictionary<Selector<any>>) => (() => (next: any) => (action: any) => any) | ((api: any) => any);
export declare function buildMiddleware<S = unknown>(local?: UpduxMiddleware[], co?: UpduxMiddleware[], sub?: Submws): UpduxMiddleware<S>;
export default buildMiddleware;
//# sourceMappingURL=index.d.ts.map