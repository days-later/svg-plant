import { SvgPlant, Genera, GenusID } from '../../../lib/main';
import { derived, Readable } from 'svelte/store';
import { seeds } from './seeds';

export const plants = Object.fromEntries( Object.keys( Genera ).map( id => {

    const gid = id as GenusID;
    const store = seeds[ gid ];
    const Genus = Genera[ gid ];

    let plant: SvgPlant;

    return [
        gid,
        derived<typeof store, SvgPlant>( store, seed => {
            if (plant) plant.cancelAnimation();
            plant = new SvgPlant( new Genus( seed ) );
            return plant;
        }),
    ];

})) as Record< GenusID, Readable<SvgPlant> >;
