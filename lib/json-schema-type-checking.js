const Ajv = require('ajv');
const StackTrace = require( 'stacktrace-js' );
import _ from 'lodash';

export default  function ValidateSchema(options) {

    let validator = new Ajv({ '$data': true, useDefaults: true });

    let shall_validate = function(schema) {
        let data = this;
        return new Promise( (resolve,reject) => {
            if (validator.validate( schema, data) ) {
                resolve();
            }
            else {
                reject(validator.errors);
            }
        })
    };

    let validate = function(schema) {
        let data = this;


        data::shall_validate(schema).catch( errors => {
            StackTrace.get().then( stack => {
                options.on_validator_error( '', 
                    { value: data, errors,
                        stack: options.groom_stack(stack)  } );
            })
        });
    };

    if( options.schemas ) {
        // TODO be smart if object or array
        _.forEach( options.schemas, (v,k) => validator.addSchema(v,k) );
    }

    if (! options.on_validator_error ) {
        let logger = require('tracer').colorConsole(
            { format: "<{{title}}> {{message}} (in {{file}}:{{line}})",
                inspectOpt: { depth: 10 },
                preprocess :  function(data){
                }
                });
        options.logger = logger;
        options.on_validator_error = ( type, data ) => {
            logger.error( type + ' value failed validation', data ) 
        };

    }

    if ( !options.groom_stack ) {
        options.groom_stack = stack => stack.filter( s => ! /json-schema-type-checking|module\.js|node\.js/.test( s.fileName )
            ).map( x => x.toString() );
    }

    let with_args = function ( args_type ) {
        let schema =
            typeof args_type == 'string' ? { '$ref': 'https://localhost/validate-schema/' + args_type } : { type: 'array', ...args_type };

        if( !schema.definitions ) {
            try { schema.definitions = options.schema.definitions }
            catch(e) { }
        }

        let validate = validator.compile(schema);
        let orig = this;

        return function(...args) {
                    if (!validate(args) ) {
                StackTrace.get().then( stack => {
                        options.on_validator_error( 'args', { args: args, errors: validate.errors,
                            stack: options.groom_stack(stack) } );
                })
                    }

                return this::orig(...args);
            };
    };

    let args = function ( args_type ) { 

        let schema =
            typeof args_type == 'string' ? { '$ref': 'https://localhost/validate-schema/' + args_type } : { type: 'array', ...args_type };

        if( !schema.definitions ) {
            try { schema.definitions = options.schema.definitions }
            catch(e) { }
        }

        let validate = validator.compile(schema);

        return function x ( target,name, descriptor ) { 
            let func = descriptor.value;

            descriptor.value = function(...args) {
                    if (!validate(args) ) {
                StackTrace.get().then( stack => {
                        options.on_validator_error( 'args', { args: args, errors: validate.errors,
                            stack: options.groom_stack(stack) } );
                })
                    }

                return func(...args);
            };
        }
    };

    let returns = function (return_type) { 
        let validate = validator.compile(
            typeof return_type == 'string' ? { '$ref': 'http://localhost/validate-schema' + return_type } : return_type );

        return function x ( target, name, descriptor ) {
            let func = descriptor.value;
            descriptor.value = function() {
                let args = arguments;
                let return_value = func(...arguments);

                if (!validate(return_value) ) {
                    StackTrace.get().then( stack => {
                            options.on_validator_error( 'return', { value: return_value, errors: validate.errors,
                                stack: options.groom_stack(stack)  } );
                    })
                }

                return return_value;
            };
        }
    }

let with_context = function (return_type) { 
    let orig = this;

    return function () {
        if (!validator.validate( return_type, this) ) {
            StackTrace.get().then( stack => {
                options.on_validator_error( 
                    'context', 
                    { 
                        value: this, 
                        errors: validator.errors, 
                        stack: options.groom_stack(stack)  
                    } 
                );
            })
        }

        return this::orig(...arguments);
    };
};

let with_return = function (return_type) { 
    let orig = this;

    return function() {
        let return_value = this::orig(...arguments);

        if (!validator.validate( return_type, return_value) ) {
            let errors = validator.errors; // promise ahead!
            StackTrace.get().then( stack => {
                    options.on_validator_error( 'return', { value: return_value, errors,
                        stack: options.groom_stack(stack)  } );
            })
        }

        return return_value;
    };
};

    return { args, returns, with_args, with_context, with_return,
        shall_validate, validate}
}
