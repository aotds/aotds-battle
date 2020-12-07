import { dux } from 'updux';
import battle from './dux';
import fp from 'lodash/fp';

console.log('classDiagram');

function printDux(slice: string, d: ReturnType<typeof dux> ) {

    const subduxes = fp.mapKeys( (k:string) => {
        return fp.startCase(
         k === '*' ? slice + '-all':
        k)
    } )(d.subduxes);

    Object.keys( subduxes ).forEach( sub =>
                                      console.log(`    ${slice} <|-- ${sub}` )
                                     );

    Object.keys( d.actions ?? {} ).forEach( action => console.log(
        `    ${slice} : ${action}`
    ));

    Object.entries( subduxes ).forEach( args => (printDux as any)(...args) );
}

printDux('Root',battle as any);
