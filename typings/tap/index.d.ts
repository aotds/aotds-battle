// There's still no official type definition
// See https://github.com/tapjs/node-tap/issues/237

// So Snyk is rolling out our own :)

// These type definitions do not aim to define all possible invokations of
// TAP functions. They are opinionated: only allowing "best practices" and so
// are aimed to help you to write clean and readable tests.

declare module 'tap' {

  // Enforce using async tests only.
  function test(name: string, options: {timeout: number}, asyncfn: (t: Test) => Promise<void>): void;
  function test(name: string, fn: (t: Test) => Promise<void>): void;

    // Assertions, see https://node-tap.org/docs/api/asserts/
    function ok(value: any, message?: string): void;
    function notOk(value: any, message?: string): void;
    function equal<T>(actual: T, expected: T, message?: string): void;
    function equals<T>(actual: T, expected: T, message?: string): void;
    function is<T>(actual: T, expected: T, message?: string): void;
    function same<T>(actual: T, expected: T, message: string): void;
    function deepEqual<T>(actual: T, expected: T, message?: string): void;
    function match(actual: string | undefined, expected: string | RegExp, message?: string): void;
    function match<T>(actual: T, expected: MatchObject<T>, message?: string): void;
    function rejects<T>(p: Promise<T>, matcher?: RegExp, message?: string): void;

    function fail(message: string): void;
    function pass(message: string): void;
    function bailout(message: string): void;

    const Test: any;


    // Intentionally NOT including plan and end. You should use async tests.
    // plan(n: number): void;
    // end(): void;

    function cleanSnapshot(...args: any[]): any;
    function matchSnapshot(...args: any[]): any;

    type MatchObject<T, K extends keyof T> = Partial<
        {
            // A subset of fields of original object, but RegExp's can appear in
            // place of strings
            [P in K]: T[P] | MatchObject<T[P], keyof T[P]> | RegExp | undefined;
        }
    >;

    export interface Test {
        // Subtests
        test(name: string, options: { timeout: number }, fn: (t: Test) => void): void;
        test(name: string, fn: (t: Test) => void): void;

        teardown(fn: () => void): void;

        fail(message: string): void;
        pass(message: string): void;
        bailout(message: string): void;

        // Assertions, see https://node-tap.org/docs/api/asserts/
        ok(value: any, message?: string): void;
        notOk(value: any, message?: string): void;
        equal<T>(actual: T, expected: T, message?: string): void;
        equals<T>(actual: T, expected: T, message?: string): void;
        is<T>(actual: T, expected: T, message?: string): void;
        same<T>(actual: T, expected: T, message: string): void;
        deepEqual<T>(actual: T, expected: T, message?: string): void;

        match(actual: string | undefined, expected: string | RegExp, message?: string): void;
        match<T>(actual: T, expected: MatchObject<T, keyof T>, message?: string): void;

        rejects<T>(p: Promise<T>, matcher?: RegExp, message?: string): void;

        cleanSnapshot(...args: any[]): any;
        matchSnapshot(...args: any[]): any;
    }
}
