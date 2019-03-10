//@format

import Redactor from '.';

import { action, union } from 'ts-action';

const foo = action('FOO');
const bar = action('BAR', (i: number) => ({ baz: i }));
const quux = action('QUUUX');
const outsider = action('OUTSIDER');

const allActions = union({ foo, bar, quux });

type State = {
    baz: number;
};

const redactor = new Redactor({ baz: 0 } as State, allActions);

redactor.addRedaction(foo, () => () => ({ baz: 123 }));
redactor.addRedaction(bar, ({ baz }) => state => ({ baz: state.baz + baz }));
redactor.addRedaction('*', () => () => ({ baz: 1 }));

test('no allActions', () => {
    const redactor = new Redactor({ baz: 0 } as State);
    redactor.reduce(undefined, outsider());
});

test('reduce', () => {
    let s = redactor.reduce(undefined, foo());
    expect(s).toEqual({ baz: 123 });

    s = redactor.reduce(s, bar(12));
    expect(s).toEqual({ baz: 135 });

    s = redactor.reduce(s, quux());
    expect(s).toEqual({ baz: 1 });
});

test('asReducer', () => {
    const reducer = redactor.asReducer;

    let s = reducer(undefined, foo());
    expect(s).toEqual({ baz: 123 });

    s = reducer(s, bar(12));
    expect(s).toEqual({ baz: 135 });
});

test('many actions', () => {
    const redactor = new Redactor({ baz: 0 } as State, allActions);

    redactor.for({ foo, bar } as any, () => ({ baz }: State) => ({ baz: baz + 1 }));
    redactor.for({ quux, '*': '*' }, () => state => state);

    expect(redactor.reduce({ baz: 0 }, foo())).toMatchObject({ baz: 1 });
});
