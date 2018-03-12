import { object, array, string, integer } from 'json-schema-shorthand';

let game_turn = object({
    game: object({
        name: string(),
    }),
    objects: array(),
}));

