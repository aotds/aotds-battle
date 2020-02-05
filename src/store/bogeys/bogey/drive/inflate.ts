import { DriveState, DriveStateShorthand } from './types';

export default (state: DriveStateShorthand): DriveState => {
    if (typeof state !== 'number') return state as DriveState;
    return { rating: state, current: state };
};
