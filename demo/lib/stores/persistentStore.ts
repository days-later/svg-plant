import { writable, Writable } from "svelte/store";

export function persistentStore<T>( id: string, init: T ): Writable<T> {

    const stored = localStorage.getItem( id );
    const parsed: T | null = stored === null ? null : JSON.parse( stored );

    const store = writable<T>( parsed !== null ? parsed : init );

    store.subscribe( (v: T) => {
        localStorage.setItem( id, JSON.stringify( v ) );
    });

    return store;
}
