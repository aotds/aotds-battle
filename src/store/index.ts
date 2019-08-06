import weapons_middleware from './middleware/weapons';
import { mw_compose } from '../middleware/utils';

export const middleware = mw_compose([
    weapons_middleware,
]);
