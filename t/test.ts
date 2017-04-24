import logger from '../lib/Logger';

class AotdsType {
    readonly type : string;

    constructor() {
        this.type = Object.getPrototypeOf(this).constructor.name.toUpperCase();
    }
}

class Foo extends AotdsType {

    constructor() { super() }

    get thingy () {
        return "stuff";
    }
}

let x= new Foo();

logger.level = 'debug';
logger.debug( "got it", x.thingy  );

//console.log( Foo.type );

