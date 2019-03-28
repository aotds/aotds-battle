import _ from 'lodash';
import u from 'updeep';
import Redactor from "../../reducer/redactor";
import { init_game } from "../actions/phases";

const redactor = new Redactor({
    name: '',
    turn: 0,
});

redactor.for( init_game, ({payload: { game }}) => {
    return u( _.pick( game, [ 'name' ] ) )
});

export default redactor.asReducer;
