import schema from './schema';

const SmallNumber = { type: 'integer', maximum: 3 };
const Quux        = '$~/quux';

const doIt = schema.jssert_f( [ Quux ], SmallNumber )( 
function( thing ) {
    return thing.bar + 1;
});


console.log( doIt( { bar: 1 } ) );
console.log( doIt( { baz: 1 } ) );
console.log( doIt( { bar: 9 } ) );
