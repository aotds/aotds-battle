import _ from 'lodash';

export const object_by_id = ( store, id ) => _.find( store.objects, { id } );

export const get_bogey = ( store, bogey_id ) => _.get( store, `bogeys.${bogey_id}` );
