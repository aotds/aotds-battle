export type Arc = 'F' | 'FS' | 'AS' | 'A' | 'AF' | 'FP';
export type Range = [ number, number ];

export const arc_ranges :Record< Arc, Range[] > = {
    F:  [[ -1, 1 ]],
    FS: [[ 1, 3 ]],
    AS: [[ 3, 5 ]],
    A:  [ [ -6, -5 ], [ 5, 6 ] ],
    AF: [[ -5, -3 ]],
    FP: [[ -3, -1 ]],
};
