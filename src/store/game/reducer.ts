import _ from 'lodash';
import u from 'updeep';
import Redactor from "../../reducer/redactor";
import { init_game, play_turn } from "../actions/phases";
import { GameState } from './types';

const redactor = new Redactor({
  name: "",
  players: [],
  turn: 0
} as GameState);

redactor.for(init_game, ({ payload: { game } }) =>
  u(_.pick(game, ["name", "players"]))
);

redactor.for(play_turn, () => u({ turn: (x: number) => x+1 }) );

export default redactor.asReducer;
