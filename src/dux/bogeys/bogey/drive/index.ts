import Updux from '../../../../BattleUpdux';
import fp from 'lodash/fp';

type DriveState = {
    rating: number;
    current: number;
    damage_level?: 0 | 1 | 2;
};

const dux = new Updux({
    initial: {
        rating: 0,
        current: 0,
    } as DriveState,
});

type DriveShorthand = number | DriveState;

export function inflate(shorthand: DriveShorthand = 0): DriveState {
    if (typeof shorthand === 'number')
        return {
            current: shorthand,
            rating: shorthand,
            damage_level: 0,
        };

    return fp.defaults({ damage_level: 0 }, shorthand);
}

module.exports = {
    ...dux.asDux,
    inflate,
};
