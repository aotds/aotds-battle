
const mwFor = (...target) => inner => store => next => action => 
    (target.indexOf(action.type) === -1 ? next : inner(store)(next))(action);


let x = mwFor( 'FOO' )( 
    store => next => action => {
        console.log( "it's a foo!" );
        next(action);
    }
);

let n = x => console.log( "regular next: ", x );

x( null )( n )( { type: 'BAR' } );
x( null )( n )( { type: 'FOO' } );

const mwForD = (...targetTypes) => ( target, key, descriptor ) => {
    const original = descriptor.value;
    descriptor.value = store => next => action => 
    (targetTypes.indexOf(action.type) === -1 ? next : original(store)(next))(action);
};

class MyMiddlewares {
    @mwForD('FOO')
    static watchingForFoo(store){
        return next => action => { 
            console.log( "it's a foo!" );
            next(action);
        }
    }
}

MyMiddlewares.watchingForFoo(null)(n)({type: 'FOO' });
MyMiddlewares.watchingForFoo(null)(n)({type: 'FOOL' });
