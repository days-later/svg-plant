import { Genera, GenusID } from '../../../lib/main';
import type { Writable } from 'svelte/store';
import { persistentStore} from './persistentStore';

export const seeds = Object.fromEntries( Object.keys( Genera ).map( id => {

    return [
        id as GenusID,
        persistentStore<string|number>( 'seeds-' + id, 0 ),
    ];

})) as Record<GenusID,Writable<string|number>>;
