

export const movement_phase_mw :Middleware = ({getState,dispatch}) => (next) => (action) => {

    const bogeys = get_bogeys(getState());

    // we can already collect all the bogeys because right now the bogeys can't be destroyed or
    // modified by other bogeys' movements

    bogeys.map( bogey => move_bogey( bogey.id, plot_movement(bogey) ) ).map( dispatch );
};
