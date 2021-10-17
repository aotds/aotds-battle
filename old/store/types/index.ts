import { LogState } from '../log/reducer/types';
import { GameState } from '../game/types';
import { BogeysState } from '../bogeys/types';

export type BattleState = {
	log: LogState;
	game: GameState;
	bogeys: BogeysState;
};
