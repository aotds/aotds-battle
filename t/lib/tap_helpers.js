import * as _ from 'lodash'; 

export default function(tap) {
    tap.Test.prototype.addAssert('has_coords', 2, function ( observed, expected, message, extra) {

        if ( ! message ) message = 'has_coords';

        if( !Array.isArray( expected ) ) expected = expected.coords;
        if( !Array.isArray( observed ) ) observed = observed.coords;

        if (_.sum( _.zip( observed, expected ).map( x => Math.pow( x[0] - x[1], 2 ) ) ) < 0.01 ) {
            return this.pass( message );
        }

        return this.same( observed, expected, message );
    })

    tap.Test.prototype.addAssert('match_move', 2, function ( observed, expected, message, extra) {

        return this.test( message || 'match_move', tap => {
            if ( expected.coords ) {
                tap.has_coords(  observed, expected );
            }

            observed = _.omit( observed, [ 'coords' ] );
            expected = _.omit( expected, [ 'coords' ] );

            tap.match( observed, expected );
            tap.end();
        });
    })
}
