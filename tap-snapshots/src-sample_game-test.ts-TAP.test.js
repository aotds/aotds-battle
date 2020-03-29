/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`src/sample_game/test.ts TAP turn 0 > state 1`] = `
Object {
  "bogeys": Array [],
  "game": Object {
    "name": "",
    "turn": 0,
  },
  "log": Array [],
}
`

exports[`src/sample_game/test.ts TAP turn 1 > state 1`] = `
Object {
  "bogeys": Array [
    Object {
      "drive": Object {
        "current": 6,
        "rating": 6,
      },
      "id": "enkidu",
      "name": "Enkidu",
      "navigation": Object {
        "coords": Array [
          1.5,
          0.8660254037844388,
        ],
        "heading": 1,
        "maneuvers": Object {
          "bank": Array [
            -3,
            3,
          ],
          "thrust": Array [
            0,
            4,
          ],
          "turn": Array [
            -3,
            3,
          ],
        },
        "thrust_used": 3,
        "trajectory": Array [
          Object {
            "coords": Array [
              0,
              0,
            ],
            "type": "POSITION",
          },
          Object {
            "coords": Array [
              1,
              6.123233995736766e-17,
            ],
            "delta": Array [
              1,
              6.123233995736766e-17,
            ],
            "type": "BANK",
          },
          Object {
            "delta": 0,
            "heading": 0,
            "type": "ROTATE",
          },
          Object {
            "delta": 1,
            "heading": 1,
            "type": "ROTATE",
          },
          Object {
            "coords": Array [
              1.5,
              0.8660254037844388,
            ],
            "delta": Array [
              0.49999999999999994,
              0.8660254037844387,
            ],
            "type": "MOVE",
          },
        ],
        "velocity": 1,
      },
      "orders": Object {},
      "player_id": "yanick",
      "structure": Object {
        "armor": Object {
          "current": 4,
          "rating": 4,
        },
        "hull": Object {
          "current": 4,
          "rating": 4,
        },
        "shields": Array [
          Object {
            "id": 0,
            "level": 1,
          },
          Object {
            "id": 1,
            "level": 2,
          },
        ],
      },
      "weaponry": Object {
        "firecons": Array [
          Object {
            "id": 1,
          },
        ],
        "weapons": Array [
          Object {
            "arcs": Array [
              "F",
            ],
            "id": 0,
            "weapon_class": 2,
            "weapon_type": "beam",
          },
          Object {
            "arcs": Array [
              "FS",
            ],
            "id": 1,
            "weapon_class": 1,
            "weapon_type": "beam",
          },
          Object {
            "arcs": Array [
              "FP",
            ],
            "id": 2,
            "weapon_class": 1,
            "weapon_type": "beam",
          },
        ],
      },
    },
    Object {
      "drive": Object {
        "current": 6,
        "rating": 6,
      },
      "id": "siduri",
      "name": "Siduri",
      "navigation": Object {
        "coords": Array [
          10,
          9,
        ],
        "heading": 6,
        "maneuvers": Object {
          "bank": Array [
            -3,
            3,
          ],
          "thrust": Array [
            0,
            6,
          ],
          "turn": Array [
            -3,
            3,
          ],
        },
        "thrust_used": 1,
        "trajectory": Array [
          Object {
            "coords": Array [
              10,
              10,
            ],
            "type": "POSITION",
          },
          Object {
            "coords": Array [
              10,
              9,
            ],
            "delta": Array [
              1.2246467991473532e-16,
              -1,
            ],
            "type": "MOVE",
          },
        ],
        "velocity": 1,
      },
      "orders": Object {},
      "player_id": "yenzie",
      "structure": Object {
        "armor": Object {
          "current": 4,
          "rating": 4,
        },
        "hull": Object {
          "current": 4,
          "rating": 4,
        },
        "shields": Array [
          Object {
            "id": 0,
            "level": 1,
          },
          Object {
            "id": 1,
            "level": 2,
          },
        ],
      },
      "weaponry": Object {
        "firecons": Array [
          Object {
            "id": 1,
          },
        ],
      },
    },
  ],
  "game": Object {
    "name": "gemini",
    "players": Array [
      Object {
        "id": "yanick",
      },
      Object {
        "id": "yenzie",
      },
    ],
    "turn": 1,
  },
  "log": Array [
    Object {
      "meta": Object {
        "action_id": 1,
        "timestamp": "",
      },
      "payload": Object {
        "bogeys": Array [
          Object {
            "drive": Object {
              "current": 6,
              "rating": 6,
            },
            "id": "enkidu",
            "name": "Enkidu",
            "navigation": Object {
              "coords": Array [
                0,
                0,
              ],
              "heading": 0,
              "velocity": 0,
            },
            "player_id": "yanick",
            "structure": Object {
              "armor": Object {
                "current": 4,
                "rating": 4,
              },
              "hull": Object {
                "current": 4,
                "rating": 4,
              },
              "shields": Array [
                Object {
                  "id": 0,
                  "level": 1,
                },
                Object {
                  "id": 1,
                  "level": 2,
                },
              ],
            },
            "weaponry": Object {
              "firecons": 1,
              "weapons": Array [
                Object {
                  "arcs": Array [
                    "F",
                  ],
                  "id": 0,
                  "weapon_class": 2,
                  "weapon_type": "beam",
                },
                Object {
                  "arcs": Array [
                    "FS",
                  ],
                  "id": 1,
                  "weapon_class": 1,
                  "weapon_type": "beam",
                },
                Object {
                  "arcs": Array [
                    "FP",
                  ],
                  "id": 2,
                  "weapon_class": 1,
                  "weapon_type": "beam",
                },
              ],
            },
          },
          Object {
            "drive": Object {
              "current": 6,
              "rating": 6,
            },
            "id": "siduri",
            "name": "Siduri",
            "navigation": Object {
              "coords": Array [
                10,
                10,
              ],
              "heading": 6,
              "velocity": 0,
            },
            "player_id": "yenzie",
            "structure": Object {
              "armor": Object {
                "current": 4,
                "rating": 4,
              },
              "hull": Object {
                "current": 4,
                "rating": 4,
              },
              "shields": Array [
                Object {
                  "id": 0,
                  "level": 1,
                },
                Object {
                  "id": 1,
                  "level": 2,
                },
              ],
            },
          },
        ],
        "game": Object {
          "name": "gemini",
          "players": Array [
            Object {
              "id": "yanick",
            },
            Object {
              "id": "yenzie",
            },
          ],
        },
      },
      "type": "init_game",
    },
    Object {
      "meta": Object {
        "action_id": 2,
        "timestamp": "",
      },
      "payload": Object {
        "bogey_id": "enkidu",
        "done": true,
        "orders": Object {
          "navigation": Object {
            "bank": 1,
            "thrust": 1,
            "turn": 1,
          },
        },
      },
      "type": "set_orders",
    },
    Object {
      "meta": Object {
        "action_id": 4,
        "timestamp": "",
      },
      "payload": Object {
        "bogey_id": "siduri",
        "done": true,
        "orders": Object {
          "navigation": Object {
            "thrust": 1,
          },
        },
      },
      "type": "set_orders",
    },
    Object {
      "meta": Object {
        "action_id": 6,
        "timestamp": "",
      },
      "subactions": Array [
        Object {
          "meta": Object {
            "action_id": 7,
            "timestamp": "",
          },
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 8,
                "timestamp": "",
              },
              "payload": "enkidu",
              "subactions": Array [
                Object {
                  "meta": Object {
                    "action_id": 9,
                    "timestamp": "",
                  },
                  "payload": Object {
                    "bogey_id": "enkidu",
                    "course": Object {
                      "coords": Array [
                        1.5,
                        0.8660254037844388,
                      ],
                      "heading": 1,
                      "maneuvers": Object {
                        "bank": Array [
                          -3,
                          3,
                        ],
                        "thrust": Array [
                          0,
                          4,
                        ],
                        "turn": Array [
                          -3,
                          3,
                        ],
                      },
                      "thrust_used": 3,
                      "trajectory": Array [
                        Object {
                          "coords": Array [
                            0,
                            0,
                          ],
                          "type": "POSITION",
                        },
                        Object {
                          "coords": Array [
                            1,
                            6.123233995736766e-17,
                          ],
                          "delta": Array [
                            1,
                            6.123233995736766e-17,
                          ],
                          "type": "BANK",
                        },
                        Object {
                          "delta": 0,
                          "heading": 0,
                          "type": "ROTATE",
                        },
                        Object {
                          "delta": 1,
                          "heading": 1,
                          "type": "ROTATE",
                        },
                        Object {
                          "coords": Array [
                            1.5,
                            0.8660254037844388,
                          ],
                          "delta": Array [
                            0.49999999999999994,
                            0.8660254037844387,
                          ],
                          "type": "MOVE",
                        },
                      ],
                      "velocity": 1,
                    },
                  },
                  "type": "bogey_movement_move",
                },
              ],
              "type": "bogey_movement",
            },
            Object {
              "meta": Object {
                "action_id": 10,
                "timestamp": "",
              },
              "payload": "siduri",
              "subactions": Array [
                Object {
                  "meta": Object {
                    "action_id": 11,
                    "timestamp": "",
                  },
                  "payload": Object {
                    "bogey_id": "siduri",
                    "course": Object {
                      "coords": Array [
                        10,
                        9,
                      ],
                      "heading": 6,
                      "maneuvers": Object {
                        "bank": Array [
                          -3,
                          3,
                        ],
                        "thrust": Array [
                          0,
                          6,
                        ],
                        "turn": Array [
                          -3,
                          3,
                        ],
                      },
                      "thrust_used": 1,
                      "trajectory": Array [
                        Object {
                          "coords": Array [
                            10,
                            10,
                          ],
                          "type": "POSITION",
                        },
                        Object {
                          "coords": Array [
                            10,
                            9,
                          ],
                          "delta": Array [
                            1.2246467991473532e-16,
                            -1,
                          ],
                          "type": "MOVE",
                        },
                      ],
                      "velocity": 1,
                    },
                  },
                  "type": "bogey_movement_move",
                },
              ],
              "type": "bogey_movement",
            },
          ],
          "type": "movement_phase",
        },
        Object {
          "meta": Object {
            "action_id": 12,
            "timestamp": "",
          },
          "type": "firecon_orders_phase",
        },
        Object {
          "meta": Object {
            "action_id": 13,
            "timestamp": "",
          },
          "type": "weapon_orders_phase",
        },
        Object {
          "meta": Object {
            "action_id": 14,
            "timestamp": "",
          },
          "type": "weapon_firing_phase",
        },
        Object {
          "meta": Object {
            "action_id": 15,
            "timestamp": "",
          },
          "type": "clear_orders",
        },
      ],
      "type": "play_turn",
    },
  ],
}
`
