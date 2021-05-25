import { SvgPlant, Genera } from '../../lib/main';
import { derived, writable } from 'svelte/store';

type GenusID = keyof typeof Genera;
type PlantCfg = { seed: string, genus: GenusID };

let generaKeys = Object.keys( Genera ) as GenusID[];

const lsKey = 'svg-plant-demo-app';
const cfg: CfgData = JSON.parse( localStorage.getItem( lsKey ) || '{}' ) || {};

export const initialCfg = {
    seed: cfg.seeds && cfg.seeds[ cfg.genus ] ? cfg.seeds[ cfg.genus ] : '',
    genus: cfg.genus && cfg.genus in Genera ? cfg.genus : generaKeys[ 0 ],
    color: cfg.color ?? true,
    fill: '',
    age: cfg.age ?? 1,
};

export const seeds: Record<GenusID,string> = cfg.seeds || {};

export const Cfg = {
    plant: writable<PlantCfg>({ seed: initialCfg.seed, genus: initialCfg.genus }),
    color: writable<boolean>( initialCfg.color ),
    fill: writable<string>( initialCfg.fill ),
    age: writable<number>( initialCfg.age ),
};

Cfg.plant.subscribe( cfg => {
    seeds[ cfg.genus ] = cfg.seed;
});

type CfgData = {
    seeds: Record<GenusID,string>,
    genus: GenusID,
    color: boolean,
    age: number,
};
const onChange = derived<[ typeof Cfg.plant, typeof Cfg.color, typeof Cfg.age ], CfgData>( [ Cfg.plant, Cfg.color, Cfg.age ], data => {
    return {
        seeds,
        genus: data[ 0 ].genus,
        color: data[ 1 ],
        age: data[ 2 ],
    };
});
onChange.subscribe( data => localStorage.setItem( lsKey, JSON.stringify( data ) ) );

export const genusName = derived<typeof Cfg.plant, string>( Cfg.plant, plantCfg => {
    return Genera[ plantCfg.genus ].genusName;
});

function getSvgPlant( seed: string, genus: GenusID, color: boolean ) {
    const Genus = Genera[ genus ];
    return new SvgPlant( new Genus( seed ), { color } );
}

let plant: SvgPlant;
export const svgPlant = derived<[ typeof Cfg.plant, typeof Cfg.color ], SvgPlant>( [ Cfg.plant, Cfg.color ], ([ plantCfg, color ]) => {
    if (plant) plant.cancelAnimation();
    plant = getSvgPlant( plantCfg.seed, plantCfg.genus, color );
    return plant;
});

let prevPlantCfg: PlantCfg;
export const svgPlantUpdate = derived<[ typeof Cfg.plant, typeof Cfg.color ], { regrow: boolean }>( [ Cfg.plant, Cfg.color ], ([ plantCfg ]) => {
    const regrow = !prevPlantCfg || (prevPlantCfg.seed !== plantCfg.seed && prevPlantCfg.genus === plantCfg.genus);
    prevPlantCfg = plantCfg;
    return { regrow };
});
