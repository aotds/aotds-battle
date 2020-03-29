import Updux, {DuxState} from 'updux';
import fp from 'lodash/fp';
import _ from 'lodash';

type FireconState = {
    id: number,
    target_id?: string,
}

const getFirecon = state => id => fp.find(id,state);

const dux = new Updux({
    initial: [] as FireconState[],
    selectors: {
        getFirecon
    }
});

const fireconsDux = dux.asDux;
export default fireconsDux;

type FireconsState = DuxState<typeof fireconsDux>;

type FireconsShorthand = FireconsState | number;

export function inflateFirecons( shorthand: FireconsShorthand ): FireconsState {
    if( typeof shorthand === 'object' ) return shorthand;

    console.log("yo!");

    return _.range( 1, shorthand+1 ).map( id => ({ id}) );
}
