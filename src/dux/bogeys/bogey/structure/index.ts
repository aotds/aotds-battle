import Updux from 'updux';

import inflate from './inflate';

const dux = new Updux({
    initial: inflate(),
    actions: {},
});

export default dux.asDux;
export { inflate };
