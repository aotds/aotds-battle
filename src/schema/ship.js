import jssh from '../json-schema-shorthand';

let schema = {
    type: 'object',
    properties: {
        navigation: {
            type: 'object',
            properties: {
                heading: 'number',
                velocity: 'number',
                coords: {
                    type: 'array',
                    size: 2,
                    item: 'number',
                },
                course: {
                doc: "projected movement for new turn",
                    type: 'array',
                    [
                        { coords: [1,2], heading: 3 },
                    ]
                },
            },
        }
    },
};

export default jssh(schema);
