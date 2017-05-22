
function *bar() {

    return function *() { yield "potato" };

}

function with_blah ( ) {
    let y = this;
    return x => {
        console.log('x is ' + x ); 
        return y(x);
    };
}

function *baz() {
    yield undefined;
    yield 2;
      return 3
}

const foo = (function *(x) {
    yield x;
    yield 2;
})::with_blah();

let x =  baz('banana');

console.log( x.next() );
console.log( x.next() );
console.log( x.next() );
console.log( x.next() );
