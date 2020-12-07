import dux from '.';
import { mock_mw } from '../../utils/mock-mw';

test('init_game triggers add_ship', () => {
    const mw: any = dux.middleware;

    const res = mock_mw(mw, {
        action: dux.actions.init_game({
            bogeys: [{ id: 1 }],
        } as any),
    });

    expect(res.api.dispatch).toHaveBeenCalled();

    expect(res.api.dispatch.mock.calls[0][0]).toMatchObject(dux.actions.add_bogey({ id: 1 }));
});
