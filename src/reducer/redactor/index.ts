import _ from 'lodash';
import { Action, UpReducer, CatchAll, ActionCreator } from "../types";

type ActionGroup = { [ key: string ]: ActionCreator|CatchAll };

type ActionFor<A extends CatchAll | ActionCreator> = A extends CatchAll ? Action :
    A extends ActionCreator ? ReturnType<A> : never;

export default class Redactor<
  A extends Action = Action,
  S = {}
> {

  redactions: { [name: string]: UpReducer<S, A> } = {};

  initialState: S;

  constructor(initialState: S, allActions?: A) {
    this.initialState = initialState;
  }

  public addRedaction( action: CatchAll, reaction: UpReducer<S,A> ): UpReducer<S,A>;
  public addRedaction<B extends A>( action: (...args: any[] ) => B, reaction: UpReducer<S,B> ): UpReducer<S,A>;
  public addRedaction( action: any, reaction: any ) {
    return this.redactions[action === '*' ? '*' : (action as any).type] = reaction as UpReducer<S,A>
//    this.redactions[action === "*" ? "*" : (action as any).type] = reaction
  }

  public for<A extends ActionGroup>( actions: A,
        reaction: UpReducer<S,ActionFor<A[keyof A]> >): void;
  public for( action: CatchAll, reaction: UpReducer<S,A> ): UpReducer<S,A>;
  public for<B extends A>( action: (...args: any[] ) => B,
      reaction: UpReducer<S,B> ): UpReducer<S,A>;
  public for( action: any, reaction: any ) {
      if ( typeof action === 'function' || action === '*' )
        return this.addRedaction(action,reaction);

    _.values( action ).forEach( a => this.addRedaction(a,reaction) );
  }


  public reduce(state: S|undefined, action: A ) {
      if( state === undefined ) state = this.initialState;
      let red = this.redactions[action.type] || this.redactions["*"];
      return red ? red(action)(state) : state;
  }

  public upReduce(action: A ) {
      return ( state?: S ) => this.reduce(state,action);
  }

  get asReducer() {
    return this.reduce.bind(this);
  }

  get asUpReducer() {
    return this.upReduce.bind(this);
  }

}
