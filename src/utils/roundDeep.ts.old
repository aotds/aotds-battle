import fp from 'lodash/fp';
import _ from 'lodash';

export default function roundDeep(obj) {
    return fp.mapValues(v => (typeof v === 'object' ? roundDeep(v) : typeof v === 'number' ? _.round(v, 2) : v))(obj);
}

