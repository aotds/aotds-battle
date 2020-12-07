import { object, string, number } from 'json-schema-shorthand';
import { compile } from 'json-schema-to-typescript';

export const GameState = object(
    {
        name: string(),
        turn: number({ default: 0 }),
        external: '$./src/dux/game/Stuff.json',
    },
    { additionalProperties: false },
    'information about the game',
);

console.log(GameState);

compile(GameState as any, 'GameState', {
    declareExternallyReferenced: false,
}).then(def => console.log(def));
