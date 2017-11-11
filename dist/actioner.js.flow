//@flow


type ActionFunction = () => { type: string, payload?: any };

export default
class Actioner {

    actions : { [string]: ActionFunction } = {}

    constructor() {
    }

    add( name: string, payload_transformer: any ) {
        if ( typeof payload_transformer === 'boolean' && ! payload_transformer ) {
            this.actions[ name.toLowerCase() ] = () => ({ 
                type: name.toUpperCase()
            });
            return;
        }

        this.actions[ name.toLowerCase() ] = payload => ({ 
            type: name.toUpperCase(), 
            payload 
        });
    }

    names() : Array<string> {
        return Object.keys(this.actions).map( s => s.toUpperCase() );
    }

    combined() : Object {
        let combined = { ...this.actions };

        Object.keys(combined).forEach( k => combined[k.toUpperCase()] = k.toUpperCase() );

        return combined;
    }
}


