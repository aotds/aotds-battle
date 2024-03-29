import u from '@yanick/updeep';

expect.addSnapshotSerializer({
    serialize(val, config, indentation, depth, refs, printer) {
        return JSON.stringify(groomState(val), null, 2);
    },

    test(val) {
        return val && val.hasOwnProperty('game');
    },
});

function groomState(state) {
    return u({
        next_action_id: u.omitted,
        log: u.map(u.omit('meta')),
    })(state);
}
