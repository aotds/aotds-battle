// @format

import u from 'updeep';
import fp from 'lodash/fp';
import {
	ShieldStateShorthand,
	ShieldState,
	StructureStateShorthand,
	StructureState,
} from './types';

const add_ids = u.map((v: unknown, id: number) => u({ id }, v));

const inflate_rating = u.if(fp.isNumber, (rating: number) => ({
	current: rating,
	rating,
}));

function inflate_shields(shorthand: ShieldStateShorthand[]): ShieldState[] {
	return add_ids(
		u.map(
			u.if(fp.isNumber, (level: number) => ({ level })),
			shorthand,
		),
	);
}

export function inflate_structure(
	shorthand: StructureStateShorthand,
): StructureState {
	return u({
		hull: inflate_rating,
		armor: inflate_rating,
		shields: inflate_shields,
	})(shorthand);
}
