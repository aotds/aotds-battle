export default {
        game: {
            name: 'gemini',
            players: [ { id: "yanick" }, { id: "yenzie" } ],
        },
        bogeys: [
            { name: 'Enkidu', id: 'enkidu',
                drive: { rating: 6, current: 6 },
                navigation: {
                    coords: [ 0,0 ],
                    heading: 0,
                    velocity: 0,
                },
                weaponry: {
                    firecons: 1,
                    shields: [ 1, 2 ],
                    weapons: [ {
                        weapon_type: "beam", weapon_class: 2,
                        arcs: [ 'F' ] },
                        {  arcs: [ 'FS' ],
                        weapon_type: "beam", weapon_class: 1,
                        },
                        { arcs: [ 'FP' ],
                        weapon_type: "beam", weapon_class: 1,
                        } ],
                },
                structure: {
                    hull: { current: 4, rating: 4},
                    armor: { current: 4, rating: 4},
                },
                player_id: "yanick",
            },
            { name: 'Siduri', id: 'siduri',
                drive: { rating: 6, current: 6 },
                navigation: {
                    coords: [ 10,10 ],
                    heading: 6,
                    velocity: 0,
                },
                player_id: "yenzie",
                weaponry: { shields: [ 1, 2 ] },
                structure: {
                    hull: { current: 4, rating: 4},
                    shields: [
                        { id: 0, level: 1 },
                        { id: 1, level: 2 }
                    ],
                    armor: { current: 4, rating: 4},
                },
            },
        ],
    };
