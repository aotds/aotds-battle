import reducer from './index';

import {  actions } from '~/actions';
import { ajv } from '~/schemas';

const debug = require('debug')('aotds:test');

expect.extend({
  toMatchSchema(received) {

    const pass = ajv.validate({
        '$ref': 'http://aotds.babyl.ca/battle/game'
    }, received)

    if (pass) {
      return {
        message: () =>
          `expected schema to not be valid, but it is`,
        pass: true,
      };
    } else {
      return {
          message: () => `expected schema to be valid.\nschema: ${ JSON.stringify(received)}\nerror: ${JSON.stringify(ajv.errors)} `,
        pass: false,
      };
    }
  },
});

test('basic', () => {
    let state = reducer(undefined, { type: 'DUMMY' } );

    expect(state).toMatchObject({ game: { turn: 0 } });

    expect(state).toMatchSchema();
});

test('with bogey', () => {
   let state = reducer(undefined, actions.init_game({
       bogeys: [ {id: 'enkidu'} ]
   }));

    expect(state).toMatchSchema();

    expect(state).toHaveProperty( 'bogeys.enkidu' );
    

    debug(state);
    
});
