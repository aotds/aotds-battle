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
    description: "projected movement for new turn (for the ui)",
}));

const maneuver_range = definitions::add( 'maneuver_range', 
    "range of values for the maneuver (for the ui)",
    array('number'),
    { nbrItems: 2 }
);

const maneuvers = definitions::add( 'maneuvers', 
    "range of maneuvers the ship can do for its next move (for the ui)",
    object({
        thrust: maneuver_range,
        bank:   maneuver_range,
        turn:   maneuver_range,
    })
);


  // [ { type: 'POSITION', coords: [ 0, 0 ] },
  //   { type: 'BANK',
  //     delta: [ -1, -6.123233995736766e-17 ],
  //     coords: [ -1, -6.123233995736766e-17 ] },
  //   { type: 'ROTATE', delta: 1, heading: 1 },
  //   { type: 'MOVE',
  //     delta: [ 0.9999999999999999, 1.7320508075688774 ],
  //     coords: [ -1.1102230246251565e-16, 1.7320508075688774 ] },

const trajectory = definitions::add( 'trajectory',
    "course of the previous turn",
    array()
);

let navigation = object({
    ...heading_coords,
    velocity,
    trajectory,
    maneuvers,
});

navigation = { ...navigation, course: navigation };

// TODO add the different sub-dcp orders 

const orders = definitions::add( 'orders', object({
    done: 'boolean',
    navigation: object({
        thrust: number(),
        turn:   number(),
        bank:   number(),
    }),
    firecons: object({
        target_id:  'string',
    }),
    weapons: object({
        firecon_id: 'integer',
    }),
    damage_control_parties: array(
        object({
            system:    'string',
            system_id: number(),
            parties:   number(),
        }),
    ),
}), "orders for the next turn");


const drive = definitions::add('drive', object({
    rating: 'integer!',
    current: 'integer!',
    thrust_used: 'integer',
    damage_level: {
        type: 'integer',
        enum: [ 0, 1, 2 ],
    },
}));

const name = definitions::add( 'name', 
    "name of the ship",
    'string',
);

const firecon = definitions::add('firecon', object({
    id:        'integer!',
    target_id: 'string',
}));

const weapon = definitions::add('weapon', object({
    id: 'integer!',
    type: 'string',
    level: 'integer',
    firecon_id: 'integer',
    arcs: array({ enum: [ 'A', 'F', 'FS', 'FP', 'AS', 'AP' ] }),
}));

definitions::add( 'navigation', 
    "navigation-related attributes",
    object({
    ...heading_coords,
    velocity,
    course,
}));

const weaponry  = definitions::add('weaponry', object({
    firecons: object({},{ additionalProperties: firecon }),
    weapons: object({}, { additionalProperties: weapon }),
}));

const structure = definitions::add('structure', object({
    hull: object({ current: 'integer', max: 'integer', }),
    armor: object({ current: 'integer', max: 'integer', }),
    shields: object({}, {additionalProperties: { id: 'integer', level: 'integer' } }),
    destroyed: 'boolean',
}));

const damage_control_parties = definitions::add( 'damage_control_parties',
    object({ max: number(), current: number(), }),
);

export default object(
    { 
        id: 'string',
        name,
        navigation, 
        damage_control_parties,
        orders, 
        drive,
        weaponry,
        structure,
        player_id: 'string',
    },
    {
        '$id': 'http://aotds.babyl.ca/battle/ship',
        definitions,
        title: "Ship",
    }
);
