// @format
import _ from 'lodash';
import Redactor from '../../reducer/redactor';
import { init_game } from '../actions/phases';

const redactor = new Redactor({});

redactor.for(init_game, ({ payload: { bogeys } }) => state => _.keyBy(bogeys, 'id'));

export default redactor.asReducer;
