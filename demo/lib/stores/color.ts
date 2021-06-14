import { persistentStore } from "./persistentStore";

export const color = persistentStore<boolean>( 'color', true );
