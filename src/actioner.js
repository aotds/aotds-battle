export default
class Actioner {

    actions = {}

    constructor() {
    }

    add( name, payload_transforme ) {
        if ( typeof payload_transformer === 'boolean' && ! payload_transformer ) {
            this.actions[ name.toLowerCase() ] = () => ({ 
                type: name.toUpperCase()
            });
            return;
        }

        this.actions[ name.toLowerCase() ] = payload => ({ 
            ...payload,
            type: name.toUpperCase(), 
        });
    }

    names() {
        return Object.keys(this.actions).map( s => s.toUpperCase() );
    }

    combined() {
        let combined = { ...this.actions };

        Object.keys(combined).forEach( k => combined[k.toUpperCase()] = k.toUpperCase() );

        return combined;
    }
}


