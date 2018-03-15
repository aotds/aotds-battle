import _ from 'lodash';

export const get_object_by_id = ( store, id ) => _.find( store.objects, { id } );

