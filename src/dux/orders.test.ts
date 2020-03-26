import tap from 'tap';
import Battle from '.';

const battle = Battle.createStore({
    bogeys: [{ id: 'enkidu' }, { id: 'siduri' }],
} as any);

battle.dispatch(
    battle.actions.set_orders('enkidu', {
        navigation: { thrust: 2 },
    }),
);

const state = battle.getState();
const getBogey = Battle.selectors.getBogey(state);

tap.same(getBogey('siduri')?.orders, {}, 'siduri has no orders');

const enkidu = getBogey('enkidu');

tap.is( enkidu?.orders?.navigation?.thrust, 2, 'orders are in' );
tap.match( enkidu?.orders?.done, /^202/, 'done is timestamped' );
