import { mw_compose, subactions } from './utils';

test('mw_compose', () => {
    let one = store => next => action => next(action + '1');
    let two = store => next => action => next(action + '2');

    let next = jest.fn();

    let mw = mw_compose([ one, two ]);

    mw(null)(next)('0');

    expect(next).toHaveBeenCalledWith('012');
    
});

test('subactions', () => {

    let mw = subactions( store => next => action => {
        store.dispatch( { type: 'INNER' } );
    })

    let next = jest.fn();
    let dispatch = jest.fn();

    mw({dispatch})(next)({type: 'OUTER'});

    expect(dispatch).toHaveBeenCalledWith({type:'INNER'});
    expect(next).toHaveBeenCalledWith({type: 'OUTER'});
    
});
