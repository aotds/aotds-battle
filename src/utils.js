import fp from 'lodash/fp';

export const crossProduct = (...rest) => 
    fp.reduce((a, b) => fp.flatMap(x => fp.map(y =>
        x.concat([y])
    )(b))(a))([[]])(rest);
