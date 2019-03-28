import _ from 'lodash';
import { log_skipper } from ".";

test( 'log skipper', () => {
    const mw = log_skipper(['FOO'])(null as any)(_.identity as any);

    expect( mw({ type: 'BAR' } as any) ).not.toHaveProperty( 'meta.no_log' );

    expect( mw({ type: 'FOO' } as any) ).toHaveProperty( 'meta.no_log', true );


});
