import _ from 'lodash';

import { roll_dice } from './dice';

import JsonSchemaValidator from '../json-schema-type-checking';
import schemas from './schema';
import Action from './Actions';

const { with_args, returns, with_context, with_return } = JsonSchemaValidator({
    schemas
});

