import shorthand from '../json-schema-shorthand';

function add_def( name, def ) {
    this[ name ] = def;
    return { '$ref': '#/definitions/' + name }
}

function array( items, options ) {
    return {
        type: "array",
        items,
        ...options
    };
}

function object( properties, options ) {
    return {
        type: "object",
        properties,
        ...options
    };
}


let definitions = {};

let coords = definitions::add_def('coords', 
    array( 'number', { maxItems: 2, minItems: 2 } )
);

let course = definitions::add_def('course',{
    description: "projected movement for new turn",
    ...array(
        object({
            coords,
            heading: 'number',
        })
   ),
});

let schema = shorthand({
    '$id': 'https://aotds.babyl.ca/battle/ship',
    definitions,
    type: 'object',
    title: "Ship",
    description: "a ship",
    properties: {
        navigation: {
            type: 'object',
            properties: {
                heading: 'number',
                velocity: 'number',
                coords,
                course
            },
        }
    },
  }
);

export default schema;
