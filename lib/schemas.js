"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Ajv = require('ajv');

const ajv = exports.ajv = Ajv({
  '$data': true,
  useDefaults: true
});

const ship = exports.ship = require("./schemas/ship").default;

const game = exports.game = require("./schemas/game").default;

ajv.addSchema(ship);
ajv.addSchema(game); //const Ajv = require('ajv');
//const debug = require('debug')('aotds:battle:schemas');
//import jssh from 'json-schema-shorthand';
//import StackTrace from 'stacktrace-js';
//class SchemaValidationError extends Error {
//    constructor(options) {
//        super("validation failed");
//        this.validation_value = options.validation_value;
//        this.validation_errors = options.validation_errors;
//    }
//}
//export default class Schemas {
//    constructor(options={}) {
//        this.validator = new Ajv({ 
//            '$data':     true,
//            useDefaults: true,
//            loadSchema:  this.loadSchema
//        });
//        this.skipStack = [ /node\.js/, /node_modules/, /module\.js/ ];
//        this.stackFilter = entry =>
//            !this.skipStack.find( re => re.test(entry.fileName) );
//        this.fatal = options.fatal;
//        this.schema_url = options.schema_url;
//        this.validator.compile( 
//            require( './schemas/ship' ).default
//        );
//        this.validator.compile( 
//            require( './schemas/game_turn' ).default
//        );
//    }
//    async loadSchema(schema) {
//        schema = schema.replace( /^~/, './' );
//        let raw = { ...( require(schema).default ) };
//        raw['$id'] = this.schema_url + schema.replace( /^\./, '' );
//        return raw;
//    }
//    async validate(schema,value,stack) {
//        try {
//            let validate = await this.validator.compileAsync(schema);
//            if( validate( value ) ) return;
//          //  let stack = await StackTrace.get();
//            if(stack) {
//                stack = await stack;
//            }
//            //stack.shift();
//            let error = {
//                validation_errors: validate.errors,
//                validation_value: value,
//            };
//            error = new SchemaValidationError(error);
//            if( this.fatal ) {
//                setTimeout(() => {
//                    throw error
//                }, 0)
//            }
//            debug( "schema errors: %O\ndocument: %O",
//                validate.errors, value );
//        }
//        catch(e) {
//            throw e;
//        }
//    }
//    jssert_f(input,output,context) {
//        let schema = this;
//        if( input instanceof Array ) {
//            input = { type: 'array', items: input };
//        }
//        input   = jssh(input);
//        output  = jssh(output);
//        context = jssh(context);
//        return f => function(...args) {
//            if( input !== undefined ) {
//                schema.validate('function arguments',input,args,StackTrace.get({
//                    filter: schema.stackFilter
//                }));
//            }
//            let result = f(...args);
//            if( output !== undefined ) {
//                schema.validate('function output',output,result,StackTrace.get({
//                    filter: schema.stackFilter
//                })).catch( e => { console.log(e) } );
//            }
//            return result;
//        };
//    }
//}