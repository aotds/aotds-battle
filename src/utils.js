import u from 'updeep';
import _ from 'lodash';
import fp from 'lodash/fp';

export const crossProduct = (...rest) => 
    fp.reduce((a, b) => fp.flatMap(x => fp.map(y =>
        x.concat([y])
    )(b))(a))([[]])(rest);

export function ejson(obj) {
    if( _.isArray(obj) ) return u.map( ejson, obj );

    if(! _.isObject(obj) ) return obj;

    return _.map( obj,
        (v,k) => u.updateIn(k, ejson(v) )
    ).reduce( (accum,up) => up(accum) , {} );
}
