import Updux, {DuxState} from 'updux';

import { ActionCreator } from 'ts-action';
import {Action } from 'updux/dist/types';
import subactions from './subactions';

interface UpduxMiddlewareAPI<S=any> {
    dispatch: Function;
    getState(): S;
    selectors: any;
    actions: any;
}
type UpduxMiddleware<S=any,A = Action> = (
    api: UpduxMiddlewareAPI<S>
) => (action: A) => unknown;

export default <D>(dux: D) => <AC extends ActionCreator>( creator: AC, middleware: UpduxMiddleware< DuxState<D>, ReturnType<AC>>) => {
    (dux as any).addEffect( creator, subactions(middleware) );
};

