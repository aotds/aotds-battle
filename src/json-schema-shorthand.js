const _ = require('lodash');

function sh_json_schema(obj) {
    if( typeof obj === 'undefined' ) {
        return obj;
    }

    if( typeof obj === 'string' ) {
        if( obj[0] === '$' ) {
            obj = { '$ref': obj.slice(1) };
        }
        else if( obj[0] === '#' ) {
            obj = { '$ref': obj }
        }
        else { 
            obj = { type: obj }; 
        }
    }

    [ '$ref', 'type' ].forEach( field => {
        if( /!$/.test( obj[field] ) ) {
            obj.required = true;
            obj[field] = obj[field].replace( /!$/, '' );
        }
    });

    if( obj.hasOwnProperty('object') ) {
        obj.type = 'object';
        obj.properties = obj.object;
        delete obj.object;
    }

    [ 'definitions' ]
        .filter( k => obj.hasOwnProperty(k) )
        .forEach( keyword => {
            obj[keyword] = _.mapValues( obj[keyword], v => sh_json_schema(v) )
    } );

    [ 'anyOf', 'allOf', 'oneOf' ]
        .filter( k => obj.hasOwnProperty(k) )
        .forEach( keyword => {
            obj[keyword] = obj[keyword].map( v => sh_json_schema(v) )
    } );

    [ 'not' ]
        .filter( k => obj.hasOwnProperty(k) )
        .forEach( keyword => {
            obj[keyword] = sh_json_schema(obj[keyword])
    } );

    if( obj.hasOwnProperty('array') ) {
        obj.type = 'array';
        obj.items = Array.isArray(obj.array) ? obj.array.map(sh_json_schema) : sh_json_schema(obj.array);
        delete obj.array;
    }

    if( obj.hasOwnProperty('properties') ) {
        obj.properties = _.mapValues(obj.properties,
                v => sh_json_schema(v) );
    }

    if( obj.hasOwnProperty('properties') ) {
        let required = obj.required || [];
        required = required.concat(
            _.keys( obj.properties ).filter(
                k => obj.properties[k].required
            )
        );

        obj.properties = _.mapValues(
            obj.properties,
            v => _.omit( v, 'required' )
        );

        if( required.length > 0 ) {
            required.sort();
            obj.required = required;
        }
    }

    if( obj.hasOwnProperty('items') ) {
        if( Array.isArray( obj.items ) ) {
            obj.items = obj.items.map( sh_json_schema );
        }
        else {
            obj.items = sh_json_schema( obj.items );
        }
    }


    return obj;
}

export default function shorthand_json(schema) {
    return sh_json_schema(schema);
}

