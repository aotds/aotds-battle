import { assess_turn } from './turn';
import { play_turn } from '../store/actions/phases';

const debug = require('debug')('aotds:saga');

test( 'no issued orders, no turn', () => {

    let saga = assess_turn();

    saga.next(); // get bogeys

    saga.next([
        {
            player: 'yenzie',
        },
        {
            player: 'yanick',
        },
        {
        }
    ]);

    expect( saga.next() ).toHaveProperty( 'done', true );
});

test( 'issued orders, turn triggered!', () => {

    let saga = assess_turn();

    saga.next(); // get bogeys

    let r = saga.next([
        {
            player: 'yenzie',
            orders: { issued: true },
        },
        {
            player: 'yanick',
            orders: { issued: true },
        },
        {
            id: 'asteroid',
        }
    ]);

    expect( r ).toHaveProperty( 'done', true );
    expect(r).toHaveProperty( 'value.payload.action.type', play_turn.type );
});

