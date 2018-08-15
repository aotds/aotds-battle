import u from 'updeep';
import fp from 'lodash/fp';
import _ from 'lodash';

const shields = u.if( fp.isArray,
    _.flow(
        u.map( (v,id) => u({id: id+1})(v) ),
        fp.keyBy('id'),
    )
);

export default function inflate(state) {
    let inflate_hull = x => typeof x === 'number' ? { current: x, max: x } : x;

    let i = 1;
    return u({ 
        hull: inflate_hull, 
        armor: inflate_hull,
        shields 
    })(state);
}
