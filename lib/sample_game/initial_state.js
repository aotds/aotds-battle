"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  game: {
    name: 'gemini',
    players: [{
      id: "yanick"
    }, {
      id: "yenzie"
    }]
  },
  bogeys: [{
    name: 'Enkidu',
    id: 'enkidu',
    drive: {
      rating: 6,
      current: 6
    },
    navigation: {
      coords: [0, 0],
      heading: 0,
      velocity: 0
    },
    weaponry: {
      firecons: 1,
      weapons: [{
        type: "beam",
        class: 2,
        arcs: ['F']
      }, {
        arcs: ['FS'],
        type: "beam",
        class: 1
      }, {
        arcs: ['FP'],
        type: "beam",
        class: 1
      }]
    },
    structure: {
      hull: 4,
      shields: [1, 2],
      armor: 4,
      status: 'nominal'
    },
    player_id: "yanick"
  }, {
    name: 'Siduri',
    id: 'siduri',
    drive: {
      rating: 6,
      current: 6
    },
    navigation: {
      coords: [10, 10],
      heading: 6,
      velocity: 0
    },
    player_id: "yenzie",
    structure: {
      hull: 4,
      shields: [1, 2],
      armor: 4,
      status: 'nominal'
    }
  }]
};