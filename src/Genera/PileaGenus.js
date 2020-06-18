import { BaseGenus } from "./BaseGenus";
import { plantHelper } from "../util/util";

class PileaGenus extends BaseGenus {

    constructor( rngSeed ) {
        super( rngSeed );

        this.width = 4.6;
        this.height = 4.1;
        this.maxBranchNum = 1;

        this.segmentStyle = {
            stem: {
                stroke: '#931',
                fill: '#400',
                'stroke-width': .0075,
            },
            offshoot: {
                stroke: '#931',
                fill: '#400',
                'stroke-width': .0075,
            },
            branch: {
                stroke: '#041',
                fill: '#161',
                'stroke-width': .0075,
            },
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
    getOffshoots( node ) {
        if (node.pos.isLast) return plantHelper.repeat( this.rng, 1, 12, () => {
            return {
                n: this.rng.intRange( 3, 6 ),
                attr: {
                    segmentAngle: node.attr.angle + this.rng.range( -40, 40 ),
                    branchArchAngle: this.rng.ranges([ -40, -5 ], [ 5, 40 ]),
                }
            };
        });

        if (node.pos.num) return plantHelper.repeat( this.rng, 0, 4, () => {
            return {
                n: this.rng.intRange( 2, 3 ),
                attr: {
                    segmentAngle: node.attr.angle + this.rng.ranges([ -80, -40 ], [ 40, 80 ]),
                    branchArchAngle: this.rng.ranges([ -40, -5 ], [ 5, 40 ]),
                }
            };
        });

        return [];
    }

    getNodeWidth( pos, prev, _attr ) {
        if (pos.branchNum == 0) return this.rng.range( .1, .3 );
        if (pos.isOffshoot) return prev.attr.width;
        return this.rng.range( .05, .1 );
    }
    getSegmentLength( pos, prev, _attr ) {
        if (!prev) return this.rng.range( .6, 1.2 );
        if (pos.branchNum == 0) return prev.attr.length * .9;
        if (pos.isOffshoot) return this.rng.range( .1, .2 );
        if (pos.num == 1) {
            if (prev.branchRoot.pos.isLast) return this.rng.range( .6, 1.2 );
            return this.rng.range( .3, .6 );
        }
        return prev.attr.length * .75;
    }
    getSegmentAngle( pos, prev, _attr ) {
        if (pos.branchNum == 0) return this.rng.range( -8, 8 );
        return plantHelper.archingBranchAngle( this.rng, pos, prev, 5, .1 );
    }

    getSegmentStyle( node0, _node1 ) {
        if (node0.pos.branchNum == 0) return this.segmentStyle.stem;
        if (node0.pos.isOffshoot) return this.segmentStyle.offshoot;
        return this.segmentStyle.branch;
    }

    getLeaves( n0, n1 ) {
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