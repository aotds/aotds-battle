import _ from "lodash";
import { log_reducer } from "./index";

const testAction = (name: string, level: number = 0) => {
  let action = { type: name.toUpperCase() } as any;
  if (level) {
    action.meta = { subaction_level: level };
  }
  return action;
};


test("logs", () => {
  let state = [
      { type: 'STUFF', meta: { action_id: 1 } },
      { type: 'FOO', meta: { action_id: 2 } },
      { type: 'BAR', meta: { action_id: 3 } },
      { type: 'BAR1', meta: { action_id: 4, parent_actions: [ 3 ] } },
      { type: 'BAR2', meta: { action_id: 5, parent_actions: [ 3,4 ] } },
      { type: 'BAR3', meta: { action_id: 6, parent_actions: [ 3 ] } },
      { type: 'QUUX', meta: { action_id: 7 } },
  ].reduce((state, action) => log_reducer(state as any, action as any) as any, []);

  const onlyTypes = (entry: any) => {
    let subactions = _.get(entry, "subactions");
    return {
      [entry.type]: subactions ? subactions.map(onlyTypes) : null
    };
  };

  expect(state.map(onlyTypes)).toMatchInlineSnapshot(`
Array [
  Object {
    "STUFF": null,
  },
  Object {
    "FOO": null,
  },
  Object {
    "BAR": Array [
      Object {
        "BAR1": Array [
          Object {
            "BAR2": null,
          },
        ],
      },
      Object {
        "BAR3": null,
      },
    ],
  },
  Object {
    "QUUX": null,
  },
]
`);
});
