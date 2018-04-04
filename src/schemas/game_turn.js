import shorthand, { object, array } from 'json-schema-shorthand';

const debug = require('debug')('aotds:battle');

const schema = object(
    {
        game: object({
            name: 'string!',
            turn: 'integer!',
            turn_times: object({
                max:      'string',
                started:  'string',
                deadline: 'string',
            }),
            players: array(
                object({
                    id: 'string!',
                    status: 'string', // active, inactive
                }),
            ),
        }),
        objects: array(
            { '$ref': 'http://aotds.babyl.ca/battle/ship' }
        ),
    },
    {
        '$id': "http://aotds.babyl.ca/battle/game_turn",
    });

export default schema;
