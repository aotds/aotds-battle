import V from '@a-robu/victor';
import { rollDice } from '../dice/index';

export function entryPoint( otherPoints = [] ) {
    otherPoints = otherPoints.map( V.fromArray );

    // distance: 40-50 from origin
    // never within 20 from another entrypoint
    const vector = new V(0,1);

    const seed = rollDice(2,{nbrFaces: 100, note: "entrypoint, seed"});

    vector.rotateToDeg( 3.6 * seed[0] );
    vector.multiplyScalar( 40 + seed[1]/10 );
    vector.unfloat();

    while( otherPoints.some( x => x.distance(vector) <= 20 ) ) {
        const dice = rollDice(2,{nbrFaces:11, note: "entrypoint, moving"});
        vector.add( V.fromArray(dice) ).unfloat();
    }

    return vector.toArray();
}
