import fs from 'fs';
import schema from '../src/schema';

for ( let file of [ '../src/schemas/ship' ] ) {
    let name = file.replace( '../src/schemas/', 'schemas/'  );

    fs.writeFile(name+'.json', JSON.stringify(require(file).default, null, 2), err => {
            if (err) throw err;
    })
}
