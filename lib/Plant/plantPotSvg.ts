import { html } from "../util/util";
import type { attributeSet, pathDescriptionSegment } from '../types';

interface PlantPotCfg {
    rimHeight: number,
    rimLipOuter: number,
    rimLipInner: number,
    bottom: number,
};

function plantPotSvg( pathAttr: attributeSet ): SVGElement {
    const baseCfg: PlantPotCfg = {
        rimHeight: 20,
        rimLipOuter: 2,
        rimLipInner: 4,
        bottom: 15,
    };

    const sw = pathAttr ? ('stroke-width' in pathAttr ? pathAttr[ 'stroke-width' ] : 2) : false;
    if (sw) pathAttr[ 'stroke-width' ] = sw;

    const pad = sw && typeof sw == 'number' ? sw / 2 : 0;

    const getPoints = (cfg: PlantPotCfg): pathDescriptionSegment[] => {
        return [
            [ 'M', pad, pad ],
            [ 'L', 100-pad, pad ],
            [ 'L', 100-pad - cfg.rimLipOuter, cfg.rimHeight ],
            [ 'L', 100-pad - cfg.rimLipInner, cfg.rimHeight ],
            [ 'L', 100-pad - cfg.bottom, 100-pad ],
            [ 'L', pad+cfg.bottom, 100-pad ],
            [ 'L', pad+cfg.rimLipInner, cfg.rimHeight ],
            [ 'L', pad+cfg.rimLipOuter, cfg.rimHeight ],
            'Z',
        ];
    };

    if (!pathAttr) pathAttr = {};
    pathAttr.d = html.svg.compilePathDescription( getPoints( baseCfg ) );
    const path = html.svg.node( 'path', pathAttr );

    const svg = html.svg.root({
        class: 'svg-plant-pot',
        viewBox: '0 0 100 100',
        preserveAspectRatio: 'xMidYMax meet',
    });

    svg.appendChild( path );

    return svg;
};

export { plantPotSvg };
