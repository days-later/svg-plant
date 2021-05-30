import { readable } from "svelte/store";

export function mediaQuery( q: string, defaultValue=false ) {

    if (typeof window === "undefined") return readable<boolean>( defaultValue, () => {} );

    return readable( defaultValue, set => {
        const mq = window.matchMedia( q );
        mq.onchange = () => set( mq.matches );
        set( mq.matches );

        return () => {
            mq.onchange = null;
        };
    });
}

export const isMobile = mediaQuery( '(max-width: 450px)' );
