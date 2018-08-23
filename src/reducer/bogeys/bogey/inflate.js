import u from 'updeep';
import _ from 'lodash';
import fp from 'lodash/fp';

import structure from './structure/inflate';

const firecons = u.if( fp.isNumber,     
    fp.flow(
        fp.times(fp.add(1)),
        fp.keyBy(_.identity),
        u.map( id => ({id}) )
    )
);

const weapons = u.if( fp.isArray,
    fp.flow(
        fp.entries,
        fp.map( ([i,w]) => [ 1 + parseInt(i), { id: 1 + parseInt(i), ...w } ] ),
        fp.fromPairs,
    )
);

const drive = u.if( fp.isNumber,     
    max => ({ max, current: max })    
);


export default u({ 
    drive,
    structure,
    weaponry: { firecons, weapons },
});
