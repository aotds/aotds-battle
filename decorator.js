import JsonSchemaValidator from './json-schema-validator';

const { args, returns } = JsonSchemaValidator({
    schema: {
        definitions: { 
            coolResult: {
                type: 'object',
                properties: {
                    automagic: { default: 'tadah' },
                }
            }
        }
    },
});

class foo {

    // {} => is a schema, [] => is elements
    @args({ minItems: 2, items: [ { type: 'number' }, { type: 'number' } ]})
    @returns({ type: 'number' })
    static baz () {
        return "banana";
    }

    @args({ items: [ { type: 'number' }, { type: 'number', minimum: { '$data': '1/0' } } ] } )
    @returns( '#/definitions/coolResult' )
    static avg(min,max) {
        return { result:  (min+max)/2 };
    };

};

//console.log( foo.baz('zoo'));

console.log( foo.avg(8,3));
