import Updux  from 'updux';
import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import { internal_damage } from '../rules/checkInternalDamage';


const dux = new Updux({
    initial: [] as any[],
    actions: { internal_damage },
});

dux.addMutation(dux.actions.internal_damage, ({ system, system_id }) =>
    u.if(system === 'shield', u.map(u.if(fp.matches({ id: system_id }), { damaged: true }))),
);

export default dux.asDux;

