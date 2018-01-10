import fs from 'fs';
import schema from '../src/schema';

for ( let file of [ 'ship' ] ) {
    schema.loadSchema('~' + file).then( schema => 
        fs.writeFile('doc/'+file+'.json', JSON.stringify(schema), err => {
            if (err) throw err;
        })
    ).catch( e => console.log("ohmy",e) );
}
