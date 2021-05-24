import type { SvgPlant } from '../../lib/main';

type Params = {
    svgPlant: SvgPlant,
    age?: number,
};

export function plantAction( node: HTMLElement, { svgPlant }: Params ) {

    function init( fromAge: number ) {
        node.innerHTML = '';
        svgPlant.age = fromAge;
        node.appendChild( svgPlant.svgElement );
        if (fromAge < 1) svgPlant.animate( fromAge, 1, 1000 );
    }

    init( 0 );

    return {
        destroy() {
            svgPlant.cancelAnimation();
        },
        update({ svgPlant: _svgPlant, age }: Params) {
            if (_svgPlant !== svgPlant) {
                const regrow = svgPlant.seed !== _svgPlant.seed;
                svgPlant = _svgPlant;
                init( regrow ? 0 : 1 );
            }
            else if (age !== undefined) {
                svgPlant.cancelAnimation();
                svgPlant.age = age;
            }
        }
    }
}
