import Updux from 'updux';

import inflate from './inflate';
export { inflate };

const dux = new Updux({
    initial: [] as FireconState[],
});

export default dux.asDux;
