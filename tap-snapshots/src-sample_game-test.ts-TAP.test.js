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
      },
      "weaponry": Object {
        "firecons": Array [
          Object {
            "id": 1,
          },
        ],
        "shields": Array [
          Object {
            "id": 1,
            "level": 1,
          },
          Object {
            "id": 2,
            "level": 2,
          },
        ],
        "weapons": Array [
          Object {
            "arcs": Array [
              "F",
            ],
            "id": 1,
            "weapon_class": 2,
            "weapon_type": "beam",
          },
          Object {
            "arcs": Array [
              "FS",
            ],
            "id": 2,
            "weapon_class": 1,
            "weapon_type": "beam",
          },
          Object {
            "arcs": Array [
              "FP",
            ],
            "id": 3,
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
        "shields": Array [
          Object {
            "id": 1,
            "level": 1,
          },
          Object {
            "id": 2,
            "level": 2,
          },
        ],
        "weapons": Array [],
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
            },
            "weaponry": Object {
              "firecons": 1,
              "shields": Array [
                1,
                2,
              ],
              "weapons": Array [
                Object {
                  "arcs": Array [
                    "F",
                  ],
                  "weapon_class": 2,
                  "weapon_type": "beam",
                },
                Object {
                  "arcs": Array [
                    "FS",
                  ],
                  "weapon_class": 1,
                  "weapon_type": "beam",
                },
                Object {
                  "arcs": Array [
                    "FP",
                  ],
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
            "weaponry": Object {
              "shields": Array [
                1,
                2,
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
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 15,
                "timestamp": "",
              },
              "payload": "enkidu",
              "type": "bogey_fire",
            },
            Object {
              "meta": Object {
                "action_id": 16,
                "timestamp": "",
              },
              "payload": "siduri",
              "type": "bogey_fire",
            },
          ],
          "type": "weapon_firing_phase",
        },
        Object {
          "meta": Object {
            "action_id": 17,
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

exports[`src/sample_game/test.ts TAP turn 2 > state 1`] = `
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
          2,
          1.7320508075688776,
        ],
        "heading": 1,
        "maneuvers": Object {
          "bank": Array [
            -3,
            3,
          ],
          "thrust": Array [
            -1,
            6,
          ],
          "turn": Array [
            -3,
            3,
          ],
        },
        "thrust_used": 0,
        "trajectory": Array [
          Object {
            "coords": Array [
              1.5,
              0.8660254037844388,
            ],
            "type": "POSITION",
          },
          Object {
            "coords": Array [
              2,
              1.7320508075688776,
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
      },
      "weaponry": Object {
        "firecons": Array [
          Object {
            "id": 1,
            "target_id": "siduri",
          },
        ],
        "shields": Array [
          Object {
            "id": 1,
            "level": 1,
          },
          Object {
            "id": 2,
            "level": 2,
          },
        ],
        "weapons": Array [
          Object {
            "arcs": Array [
              "F",
            ],
            "firecon_id": 1,
            "id": 1,
            "weapon_class": 2,
            "weapon_type": "beam",
          },
          Object {
            "arcs": Array [
              "FS",
            ],
            "firecon_id": 1,
            "id": 2,
            "weapon_class": 1,
            "weapon_type": "beam",
          },
          Object {
            "arcs": Array [
              "FP",
            ],
            "firecon_id": 1,
            "id": 3,
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
          8,
        ],
        "heading": 6,
        "maneuvers": Object {
          "bank": Array [
            -3,
            3,
          ],
          "thrust": Array [
            -1,
            6,
          ],
          "turn": Array [
            -3,
            3,
          ],
        },
        "thrust_used": 0,
        "trajectory": Array [
          Object {
            "coords": Array [
              10,
              9,
            ],
            "type": "POSITION",
          },
          Object {
            "coords": Array [
              10,
              8,
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
        "shields": Array [
          Object {
            "id": 1,
            "level": 1,
          },
          Object {
            "id": 2,
            "level": 2,
          },
        ],
        "weapons": Array [],
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
    "turn": 2,
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
            },
            "weaponry": Object {
              "firecons": 1,
              "shields": Array [
                1,
                2,
              ],
              "weapons": Array [
                Object {
                  "arcs": Array [
                    "F",
                  ],
                  "weapon_class": 2,
                  "weapon_type": "beam",
                },
                Object {
                  "arcs": Array [
                    "FS",
                  ],
                  "weapon_class": 1,
                  "weapon_type": "beam",
                },
                Object {
                  "arcs": Array [
                    "FP",
                  ],
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
            "weaponry": Object {
              "shields": Array [
                1,
                2,
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
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 15,
                "timestamp": "",
              },
              "payload": "enkidu",
              "type": "bogey_fire",
            },
            Object {
              "meta": Object {
                "action_id": 16,
                "timestamp": "",
              },
              "payload": "siduri",
              "type": "bogey_fire",
            },
          ],
          "type": "weapon_firing_phase",
        },
        Object {
          "meta": Object {
            "action_id": 17,
            "timestamp": "",
          },
          "type": "clear_orders",
        },
      ],
      "type": "play_turn",
    },
    Object {
      "meta": Object {
        "action_id": 18,
        "timestamp": "",
      },
      "payload": Object {
        "bogey_id": "enkidu",
        "done": true,
        "orders": Object {
          "firecons": Array [
            Object {
              "firecon_id": 1,
              "target_id": "siduri",
            },
          ],
          "weapons": Array [
            Object {
              "firecon_id": 1,
              "weapon_id": 1,
            },
            Object {
              "firecon_id": 1,
              "weapon_id": 2,
            },
            Object {
              "firecon_id": 1,
              "weapon_id": 3,
            },
          ],
        },
      },
      "type": "set_orders",
    },
    Object {
      "meta": Object {
        "action_id": 19,
        "timestamp": "",
      },
      "subactions": Array [
        Object {
          "meta": Object {
            "action_id": 20,
            "timestamp": "",
          },
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 21,
                "timestamp": "",
              },
              "payload": "enkidu",
              "subactions": Array [
                Object {
                  "meta": Object {
                    "action_id": 22,
                    "timestamp": "",
                  },
                  "payload": Object {
                    "bogey_id": "enkidu",
                    "course": Object {
                      "coords": Array [
                        2,
                        1.7320508075688776,
                      ],
                      "heading": 1,
                      "maneuvers": Object {
                        "bank": Array [
                          -3,
                          3,
                        ],
                        "thrust": Array [
                          -1,
                          6,
                        ],
                        "turn": Array [
                          -3,
                          3,
                        ],
                      },
                      "thrust_used": 0,
                      "trajectory": Array [
                        Object {
                          "coords": Array [
                            1.5,
                            0.8660254037844388,
                          ],
                          "type": "POSITION",
                        },
                        Object {
                          "coords": Array [
                            2,
                            1.7320508075688776,
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
                "action_id": 23,
                "timestamp": "",
              },
              "payload": "siduri",
              "subactions": Array [
                Object {
                  "meta": Object {
                    "action_id": 24,
                    "timestamp": "",
                  },
                  "payload": Object {
                    "bogey_id": "siduri",
                    "course": Object {
                      "coords": Array [
                        10,
                        8,
                      ],
                      "heading": 6,
                      "maneuvers": Object {
                        "bank": Array [
                          -3,
                          3,
                        ],
                        "thrust": Array [
                          -1,
                          6,
                        ],
                        "turn": Array [
                          -3,
                          3,
                        ],
                      },
                      "thrust_used": 0,
                      "trajectory": Array [
                        Object {
                          "coords": Array [
                            10,
                            9,
                          ],
                          "type": "POSITION",
                        },
                        Object {
                          "coords": Array [
                            10,
                            8,
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
            "action_id": 25,
            "timestamp": "",
          },
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 26,
                "timestamp": "",
              },
              "payload": Object {
                "bogey_id": "enkidu",
                "firecon_id": 1,
                "orders": Object {
                  "target_id": "siduri",
                },
              },
              "type": "bogey_firecon_orders",
            },
          ],
          "type": "firecon_orders_phase",
        },
        Object {
          "meta": Object {
            "action_id": 27,
            "timestamp": "",
          },
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 28,
                "timestamp": "",
              },
              "payload": Object {
                "bogey_id": "enkidu",
                "orders": Object {
                  "firecon_id": 1,
                },
                "weapon_id": 1,
              },
              "type": "bogey_weapon_orders",
            },
            Object {
              "meta": Object {
                "action_id": 29,
                "timestamp": "",
              },
              "payload": Object {
                "bogey_id": "enkidu",
                "orders": Object {
                  "firecon_id": 1,
                },
                "weapon_id": 2,
              },
              "type": "bogey_weapon_orders",
            },
            Object {
              "meta": Object {
                "action_id": 30,
                "timestamp": "",
              },
              "payload": Object {
                "bogey_id": "enkidu",
                "orders": Object {
                  "firecon_id": 1,
                },
                "weapon_id": 3,
              },
              "type": "bogey_weapon_orders",
            },
          ],
          "type": "weapon_orders_phase",
        },
        Object {
          "meta": Object {
            "action_id": 31,
            "timestamp": "",
          },
          "subactions": Array [
            Object {
              "meta": Object {
                "action_id": 32,
                "timestamp": "",
              },
              "payload": "enkidu",
              "subactions": Array [
                Object {
                  "meta": Object {
                    "action_id": 33,
                    "timestamp": "",
                  },
                  "payload": Object {
                    "bogey_id": "enkidu",
                    "firecon_id": 1,
                  },
                  "subactions": Array [
                    Object {
                      "meta": Object {
                        "action_id": 34,
                        "timestamp": "",
                      },
                      "payload": Object {
                        "bogey_id": "enkidu",
                        "target_id": "siduri",
                        "weapon_id": 1,
                      },
                      "subactions": Array [
                        Object {
                          "meta": Object {
                            "action_id": 35,
                            "timestamp": "",
                          },
                          "payload": Object {
                            "bearing": 0.7307175370193499,
                            "bogey_id": "siduri",
                            "damage_dice": Array [
                              6,
                              5,
                            ],
                            "distance": 10.163030408244284,
                            "penetrating_damage_dice": Array [
                              3,
                            ],
                          },
                          "subactions": Array [
                            Object {
                              "meta": Object {
                                "action_id": 36,
                                "timestamp": "",
                              },
                              "payload": Object {
                                "bogey_id": "siduri",
                                "damage": 2,
                              },
                              "type": "bogey_damage",
                            },
                          ],
                          "type": "weapon_fire_outcome",
                        },
                      ],
                      "type": "weapon_fire",
                    },
                    Object {
                      "meta": Object {
                        "action_id": 37,
                        "timestamp": "",
                      },
                      "payload": Object {
                        "bogey_id": "enkidu",
                        "target_id": "siduri",
                        "weapon_id": 2,
                      },
                      "subactions": Array [
                        Object {
                          "meta": Object {
                            "action_id": 38,
                            "timestamp": "",
                          },
                          "payload": Object {
                            "aborted": true,
                            "bearing": 0.7307175370193499,
                            "bogey_id": "siduri",
                            "distance": 10.163030408244284,
                            "reason": "no firing arc",
                          },
                          "type": "weapon_fire_outcome",
                        },
                      ],
                      "type": "weapon_fire",
                    },
                    Object {
                      "meta": Object {
                        "action_id": 39,
                        "timestamp": "",
                      },
                      "payload": Object {
                        "bogey_id": "enkidu",
                        "target_id": "siduri",
                        "weapon_id": 3,
                      },
                      "subactions": Array [
                        Object {
                          "meta": Object {
                            "action_id": 40,
                            "timestamp": "",
                          },
                          "payload": Object {
                            "aborted": true,
                            "bearing": 0.7307175370193499,
                            "bogey_id": "siduri",
                            "distance": 10.163030408244284,
                            "reason": "no firing arc",
                          },
                          "type": "weapon_fire_outcome",
                        },
                      ],
                      "type": "weapon_fire",
                    },
                  ],
                  "type": "firecon_fire",
                },
              ],
              "type": "bogey_fire",
            },
            Object {
              "meta": Object {
                "action_id": 41,
                "timestamp": "",
              },
              "payload": "siduri",
              "type": "bogey_fire",
            },
          ],
          "type": "weapon_firing_phase",
        },
        Object {
          "meta": Object {
            "action_id": 42,
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
