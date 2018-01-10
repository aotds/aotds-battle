import Ajv from 'ajv';

let ajv = new Ajv();
ajv.addSchema({
    '$id': 'http://aotds/battle/movement',
    definitions: {
        'thing': {
            type: 'string'
        }
    }
});

let valid = ajv.validate( 'http://aotds/battle/movement#/definitions/thing', 12 );

if (!valid) console.log(ajv.errorsText());

console.log("meh");
