import { beforeEach, describe, test, expect, vi } from 'vitest';
import { checkNextTurn } from './checkNextTurn';

const playNextTurn = vi.fn();

const dispatch = {
    playNextTurn,
};

const getState = vi.fn();

const next = () =>{};


describe( "turn 0", () => {

    beforeEach( () => {
        playNextTurn.mockReset()
    } )

    test( 'no players', () => {

        getState.mockReturnValue({
            game: { turn: 0, players: [] }
        });

        checkNextTurn({getState, dispatch })(next)({});

        // no players? No turn
        expect(dispatch.playNextTurn).not.toHaveBeenCalled();
    });

});

