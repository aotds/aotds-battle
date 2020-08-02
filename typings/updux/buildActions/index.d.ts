import { ActionCreator } from 'ts-action';
import { Dictionary } from '../types';
declare type ActionPair = [string, ActionCreator];
declare function buildActions(actions?: ActionPair[]): Dictionary<ActionCreator<string, (...args: any) => {
    type: string;
}>>;
export default buildActions;
//# sourceMappingURL=index.d.ts.map