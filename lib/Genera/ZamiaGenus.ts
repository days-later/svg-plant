import { BaseGenus } from "./BaseGenus";
import { plantHelper, node, nodePos, nodeAttr } from "../util/util";
import type { Genus, rngSeed } from '../types';

class ZamiaGenus extends BaseGenus implements Genus {

    static genusName = 'Zamia';

    constructor( rngSeed?: rngSeed ) {
        super( rngSeed );

        this.width = 3.6;
        this.height = 3.5;
        this.maxBranchNum = 0;

        this.segmentStyle = {
            stroke: '#041',
            fill: '#161',
            'stroke-width': .0075,
        };

        this.leafStyle = {
            stroke: '#0d5',
            fill: 'rgba(0,255,110,.9)',
            'stroke-width': .01,
        };
        this.leafCurveHandles = {
            bottomAngle: 24,
            bottomLength: .6,
            topAngle: 179,
            topLength: .2,
        };
    }

    getRoots() {
        return plantHelper.repeat({
            rng: this.rng,
            n: [ 1, 3 ],
            cb: () => {
                return {
                    n: this.rng.intRange( 5, 7 ),
                    attr: {
                        ... plantHelper.rootPosAngle( this.rng, .25, 15 ),
                        branchArchAngle: this.rng.ranges([ -30, -5 ], [ 5, 30 ]),
                    }
                };
            }
        });
    }
    getOffshoots( _node: node ) {
        return [];
    }

    getNodeWidth( _pos: nodePos, prev: node | null, _attr: nodeAttr ) {
        if (!prev) return .1;
        return prev.attr.width * .8;
    }
    getSegmentLength( _pos: nodePos, prev: node | null, _attr: nodeAttr ) {
        if (!prev) return this.rng.range( .4, 1 );
        return prev.attr.length * this.rng.range( .6, .9 );
    }
    getSegmentAngle( pos: nodePos, prev: node, _attr: nodeAttr ) {
        return plantHelper.archingBranchAngle( this.rng, pos, prev, 5, .6 );
    }

    getSegmentStyle() {
        return this.segmentStyle;
    }

    getLeaves( _n0: node, n1: node ) {
        const length = n1.treeRoot.attr.length * 1.2 * (.5 + .5 * Math.sin( Math.PI * n1.pos.numFactor ));
        const angles = n1.pos.isLast ? [ -70, -30, 30, 70 ] : [ -70, 70 ];

        return plantHelper.repeat({
            rng: this.rng,
            values: angles,
            p: .89,
            cb: angle => {
                const av = this.rng.range( -6, 6 );
                const lv = this.rng.range( -.1, .1 );
                const lf = Math.abs( angle ) < 70 ? .9 : 1;

                return {
                    angle: n1.attr.angle + angle + av,
                    length: length * lf + lv,
                    handles: this.leafCurveHandles,
                    style: this.leafStyle,

                    xOffset: 0,
                    yOffset: 1,
                };
            }
        });
    }
};

export { ZamiaGenus };
