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

const drive = u.if( fp.isNumber,     
    max => ({ max, current: max })    
);


export default u({ 
    drive,
    structure,
    weaponry: { firecons },
});
