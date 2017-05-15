
function bar() {
    return x => this(x+1)
}

const foo = function(x){ return x }
    ::bar();

console.log(foo(4));
