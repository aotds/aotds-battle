import { WeaponMounted, Arc } from '../..';
import _ from 'lodash';

type Range = [number, number];
export const arc_ranges: Record<Arc, Range[]> = {
    F: [[-1, 1]],
    FS: [[1, 3]],
    AS: [[3, 5]],
    A: [
        [-6, -5],
        [5, 6],
    ],
    AP: [[-5, -3]],
    FP: [[-3, -1]],
};

export default function inArcs(arcs: Arc[], angle: number) {
    return _.flatten(_.values(_.pick(arc_ranges, arcs))).some(arc => angle >= arc[0] && angle <= arc[1]);
}
