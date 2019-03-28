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
    testAction("stuff"),
    testAction("foo"),
    testAction("bar"),
    testAction("bar1", 1),
    testAction("bar2", 2),
    testAction("bar3", 1),
    testAction("quux")
  ].reduce((state, action) => log_reducer(state, action), undefined);

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
