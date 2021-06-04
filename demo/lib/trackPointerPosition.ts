
export function trackPointerPosition( node: HTMLElement, { callback }: { callback: ({ x, y }: { x: number, y: number }) => void } ) {

    let bcr: DOMRect;

    function getPosition({ clientX, clientY }: { clientX: number, clientY: number }) {
        return {
            x: (clientX - bcr.left) / bcr.width,
            y: (clientY - bcr.top) / bcr.height,
        }
    }

    function onMouseDown( e: MouseEvent ) {
        window.addEventListener( 'mousemove', onMouseMove );
        window.addEventListener( 'mouseup', cancel );

        bcr = node.getBoundingClientRect();
        callback( getPosition( e ) );
    }
    function onMouseMove( e: MouseEvent ) {
        callback( getPosition( e ) );
    }

    function onTouchStart( e: TouchEvent ) {
        if (e.touches.length > 1) return;

        window.addEventListener( 'touchmove', onTouchMove );

        bcr = node.getBoundingClientRect();
        callback( getPosition( e.touches[ 0 ] ) );
    }
    function onTouchMove( e: TouchEvent ) {
        if (e.touches.length > 1) return;
        callback( getPosition( e.touches[ 0 ] ) );
    }

    function cancel() {
        window.removeEventListener( 'mousemove', onMouseMove );
        window.removeEventListener( 'touchmove', onTouchMove );
        window.removeEventListener( 'mouseup', cancel );
    }

    node.addEventListener( 'mousedown', onMouseDown );
    node.addEventListener( 'touchstart', onTouchStart );

    return {
        destroy() {
            cancel();
            node.removeEventListener( 'mousedown', onMouseDown );
            node.removeEventListener( 'touchstart', onTouchStart );
        },
    };
}
