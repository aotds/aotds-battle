import Redactor from "../../../../../../../../../reducer/redactor";

const redactor = new Redactor({} as NavigationState);
export const navigation_reducer = redactor.asReducer;

redactor.for( move_bogey, ({ payload: { navigation } }) => () => navigation )
