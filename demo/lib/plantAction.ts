import type { SvgPlant } from '../../lib/main';

type Params = {
    svgPlant: SvgPlant | null,
    age?: number,
};

export function plantAction( node: HTMLElement, { svgPlant }: Params ) {

    function init( fromAge: number ) {
        node.innerHTML = '';
        if (!svgPlant) return;

        svgPlant.age = fromAge;
        node.appendChild( svgPlant.svgElement );
        if (fromAge < 1) svgPlant.animate( fromAge, 1, 1000 );
    }

    init( 0 );

    return {
        destroy() {
            if (svgPlant) svgPlant.cancelAnimation();
        },
        update({ svgPlant: _svgPlant, age }: Params) {
            if (_svgPlant !== svgPlant) {
                if (_svgPlant && svgPlant) {
                    const regrow = svgPlant.seed !== _svgPlant.seed;
                    svgPlant = _svgPlant;
                    init( regrow ? 0 : 1 );
                }
                else {
                    svgPlant = _svgPlant;
                    init( 0 );
                }
            }
            else if (svgPlant && age !== undefined) {
                svgPlant.cancelAnimation();
                svgPlant.age = age;
            }
        }
    }
}
