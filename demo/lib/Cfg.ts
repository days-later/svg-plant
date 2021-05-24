import { Genera } from 'lib/main';
import { writable } from 'svelte/store';
import { getRandomColor } from './util';

type TCfg = {
    color: string,
    genus: string,
    seeds: Record<keyof typeof Genera,string | undefined>,
};

const defaultCfg: TCfg = {
    color: getRandomColor(),
    genus: Object.keys( Genera )[ 0 ],
    seeds: Object.fromEntries( Object.keys( Genera ).map( k => [ k, undefined ]) ) as TCfg["seeds"],
};

const store = writable<TCfg>( defaultCfg );
