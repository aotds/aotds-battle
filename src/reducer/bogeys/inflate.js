import u from 'updeep';
import fp from 'lodash/fp';
import _ from 'lodash';

import bogey from './bogey/inflate';

export default fp.flow([
    u.if( _.isArray, a => _.keyBy(a,'id') ),
    u.map(bogey),
]);
