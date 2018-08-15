import fs from 'fs';

for ( let file of [ '../src/schemas/ship' ] ) {
    let name = file.replace( '../src/schemas/', 'schemas/'  );

    fs.writeFile(name+'.json', JSON.stringify(require(file).default, null, 2), err => {
            if (err) throw err;
    })
}


fs.writeFile('schemas/actions.json', 
    JSON.stringify(require('../src/actions').default.schema, null, 2), err => {
        if (err) throw err;
    }
)
