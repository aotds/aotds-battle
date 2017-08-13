// @flow

type Foo  = {
    +x?: number
}

let y : Foo = { x :100  };

y.x += 2;
