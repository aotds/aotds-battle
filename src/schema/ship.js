import shorthand from 'json-schema-shorthand';

import {
    add_definition as add,
    array,
    object,
    number,
} from 'json-schema-shorthand';

let definitions = {};

let coords = definitions::add('coords', 
    array( 'number', { maxItems: 2, minItems: 2 } )
);

const velocity = definitions::add( 'velocity', number({
    description: "speed of the object",
    minimum: 0,
}));

const heading = definitions::add( 'heading', number({
    description: "facing angle of the object",
    minimum: 0,
    maximum: 12,
}));

const heading_coords = { heading, coords };

let course = definitions::add('course',
    array( object(heading_coords), {
    description: "projected movement for new turn",
}));

const maneuver_range = definitions::add( 'maneuver_range', 
    "range of values for the maneuver",
    array('number'),
    { nbrItems: 2 }
);

const maneuver = definitions::add( 'maneuver', 
    "range of maneuvers the ship can do for its next move",
    object({
        thrust: maneuver_range,
        bank:   maneuver_range,
        turn:   maneuver_range,
    })
);


const navigation = object({
    ...heading_coords,
    velocity,
    course,
    maneuver,
});

const orders = definitions::add( 'orders', object({
    done: 'boolean',
    navigation: object({
        thrust: number(),
        turn:   number(),
        bank:   number(),
    }),
}), "orders for the next turn");

const drive_rating = definitions::add('drive_rating', number() );

const name = definitions::add( 'name', 
    "name of the ship",
    string()
);

export default object(
    { 
        id: string(),
        name,
        navigation, 
        orders, 
        drive_rating,
    },
    {
        '$id': 'http://aotds.babyl.ca/battle/ship',
        definitions,
        title: "Ship",
    }
);
