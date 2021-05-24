import { SvgPlant } from "../Plant/SvgPlant";
import type { PlantBody } from "../Plant/PlantBody";
import type { GenusConstructor } from '../types';

const testPlantBodySize = (genus: GenusConstructor, n=1000) => {
    const widths: number[] = [];
    const heights: number[] = [];

    for (let i=0; i<n; i++) {
        const p = (new SvgPlant( new genus )).body;
        p.genus.width = 0;
        p.genus.height = 0;
        p.init();

        widths.push( p.bbox.width );
        heights.push( p.bbox.height );
    }

    widths.sort( (a,b) => a - b );
    heights.sort( (a,b) => a - b );

    return ( q=50 ) => {
        const i = Math.max( 0, Math.min( n-1, Math.round( q / 100 * (n-1) ) ) );
        return {
            width: widths[ i ],
            height: heights[ i ],
        };
    };
};

const findSeed = (genus: GenusConstructor, test: (p: PlantBody) => boolean, timeoutMs=10*1000) => {
    let cancel = false, n = 0, seed;
    const t0 = Date.now();

    const to = setTimeout(() => {
        cancel = true;
    }, timeoutMs );

    while (true) {
        const p = (new SvgPlant( new genus )).body;
        p.genus.width = 0;
        p.genus.height = 0;
        p.init();
        n++;

        if (test( p )) {
            clearTimeout( to );
            seed = p.genus.rngSeed;
            console.log( 'Seed found!', seed );
            break;
        }

        if (cancel) {
            console.log( 'No seed was found' );
            break;
        }
    }

    const t = ((Date.now() - t0) / 1000 ).toFixed( 2 );
    console.log( 'findSeed finished after ' + t + ' seconds and ' + n + ' tries.' );

    return seed;
};

const testPerformance = (genus: GenusConstructor, durationMs=10*1000) => {
    const t0 = Date.now();
    let n = 0;

    while (true) {
        const p = (new SvgPlant( new genus )).body;
        p.genus.width = 0;
        p.genus.height = 0;
        p.init();
        n++;

        if (Date.now() - t0 > durationMs) break;
    }

    const ms = Date.now() - t0;
    const s = ms / 1000;

    console.group( genus.name + ' Performance Test' );
    console.log( 'created ' + n + ' plants in ' + s.toFixed( 2 ) + ' seconds' );
    console.log( (n/s).toFixed(2) + ' plants/sec' );
    console.log( (ms/n).toFixed(2) + ' ms/plant' );
    console.groupEnd();

    return;
}

export {
    testPlantBodySize,
    findSeed,
    testPerformance,
}
