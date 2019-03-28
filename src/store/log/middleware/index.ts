import u from 'updeep';
import _ from 'lodash';
import { Action } from '../../../reducer/types';
import { MiddlewareAPI } from 'redux';
import Battle from '../../../battle';

export const log_skipper = _.curry( function(
  to_skip: string[],
  store: MiddlewareAPI,
  next: ( action: Action ) => any,
  action: Action
) {
    return next(
        u.if( ({type}:Action) => ( to_skip as any).includes(type),
             u.updateIn('meta.no_log',true)
        )(action)
    )
});
