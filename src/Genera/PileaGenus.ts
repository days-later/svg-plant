import { BaseGenus } from "./BaseGenus";
import { plantHelper, node, offshoot, nodePos, nodeAttr } from "../util/util";
import { Genus, rngSeed, attributeSet } from '../types';

class PileaGenus extends BaseGenus implements Genus {

    offshootSegmentStyle: attributeSet;
    branchSegmentStyle: attributeSet;

    constructor( rngSeed?: rngSeed ) {
        super( rngSeed );

        this.width = 4.6;
        this.height = 4.1;
        this.maxBranchNum = 1;

        this.segmentStyle = {
            stroke: '#931',
            fill: '#400',
            'stroke-width': .0075,
        };
        this.offshootSegmentStyle = {
            stroke: '#931',
            fill: '#400',
            'stroke-width': .0075,
        };
        this.branchSegmentStyle = {
            stroke: '#041',
            fill: '#161',
            'stroke-width': .0075,
        };

        this.leafStyle = {
            stroke: '#0d5',
            fill: 'rgba(0,255,110,.9)',
            'stroke-width': .02,
        };
        this.leafCurveHandles = {
            bottomAngle: 80,
            bottomLength: 1,
            topAngle: 100,
            topLength: .2,
        };
    }

    getRoots() {
        return [{
            n: this.rng.intRange( 0, 3 ),
            attr: plantHelper.rootPosAngle( this.rng, .25, 8 ),
        }];
    }
    getOffshoots( node: node ) {
        if (node.pos.isLast) return plantHelper.repeat({
            rng: this.rng,
            n: [ 1, 12 ],
            cb: (): offshoot => {
                return {
                    n: this.rng.intRange( 3, 6 ),
                    attr: {
                        segmentAngle: node.attr.angle + this.rng.range( -40, 40 ),
                        branchArchAngle: this.rng.ranges([ -40, -5 ], [ 5, 40 ]),
                    }
                };
            }
        });

        if (node.pos.num) return plantHelper.repeat({
            rng: this.rng,
            n: [ 0, 4 ],
            cb: (): offshoot => {
                return {
                    n: this.rng.intRange( 2, 3 ),
                    attr: {
                        segmentAngle: node.attr.angle + this.rng.ranges([ -80, -40 ], [ 40, 80 ]),
                        branchArchAngle: this.rng.ranges([ -40, -5 ], [ 5, 40 ]),
                    }
                };
            }
        });

        return [];
    }

    getNodeWidth( pos: nodePos, prev: node | null, _attr: nodeAttr ) {
        if (pos.branchNum == 0) return this.rng.range( .1, .3 );
        if (pos.isOffshoot && prev !== null) return prev.attr.width;
        return this.rng.range( .05, .1 );
    }
    getSegmentLength( pos: nodePos, prev: node | null, _attr: nodeAttr ) {
        if (!prev) return this.rng.range( .6, 1.2 );
        if (pos.branchNum == 0) return prev.attr.length * .9;
        if (pos.isOffshoot) return this.rng.range( .1, .2 );
        if (pos.num == 1) {
            if (prev.branchRoot.pos.isLast) return this.rng.range( .6, 1.2 );
            return this.rng.range( .3, .6 );
        }
        return prev.attr.length * .75;
    }
    getSegmentAngle( pos: nodePos, prev: node, _attr: nodeAttr ) {
        if (pos.branchNum == 0) return this.rng.range( -8, 8 );
        return plantHelper.archingBranchAngle( this.rng, pos, prev, 5, .1 );
    }

    getSegmentStyle( n0: node, _n1: node ) {
        if (n0.pos.branchNum == 0) return this.segmentStyle;
        if (n0.pos.isOffshoot) return this.offshootSegmentStyle;
        return this.branchSegmentStyle;
    }

    getLeaves( n0: node, n1: node ) {
        if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];

        const length = (n1.treeRoot.attr.length || 1) * this.rng.range( .4, 1.5 );
        const angle = plantHelper.segmentAngle( n0 ) + this.rng.range( -8, 8 );

        return [{
            angle,
            length,
            handles: this.leafCurveHandles,
            style: this.leafStyle,

            xOffset: 0,
            yOffset: .96,
        }];
    }
};

export { PileaGenus };