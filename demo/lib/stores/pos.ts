import { Genera, GenusID } from '../../../lib/main';
import { persistentStore } from './persistentStore';

export const pos = persistentStore<GenusID>( 'pos', Object.keys( Genera )[ 0 ] as GenusID );
