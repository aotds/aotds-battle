const Ajv = require('ajv');

export default Ajv({ 
    '$data':     true,
    useDefaults: true,
});
