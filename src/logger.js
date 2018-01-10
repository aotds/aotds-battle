export default require('pino')({
    level: process.env.LEVEL || 'fatal'
}, process.stderr);
