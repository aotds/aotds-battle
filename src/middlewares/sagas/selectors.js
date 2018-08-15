import _ from 'lodash';

export const object_by_id = ( store, id ) => _.find( store.objects, { id } );
