import { BaseGenus } from "./BaseGenus";
import { plantHelper } from "../util/util";

class DragonTreeGenus extends BaseGenus {

    constructor( rngSeed ) {
        super( rngSeed );

        this.width = 10.3;
        this.height = 8.6;
        this.maxBranchNum = 1;

        this.segmentStyle = {
            fill: '#400',
            stroke: '#931',
            'stroke-width': .0075,
        };

        this.leafStyle = {
            stroke: '#0d5',
            fill: 'rgba(0,255,110,.9)',
            'stroke-width': .02,
        };
        this.leafCurveHandles = {
            bottomAngle: 30,
            bottomLength: .2,
            topAngle: 179,
            topLength: .2,
        };
    }

    getRoots() {
        return [
            {
                n: this.rng.intRange( 2, 4 ),
                attr: plantHelper.rootPosAngle( this.rng, .5, 6 ),
            },
        ];
    }
    getOffshoots( node ) {
        if (!node.pos.isLast) return [];

        const p = .75;
        const steps = { from: -60, to: 60, step: 30 };

        return plantHelper.repeat( this.rng, steps, p, angle => {
            return {
                n: 2,
                attr: {
                    segmentAngle: node.attr.angle + angle + this.rng.range( -10, 10 ),
                }
            };
        });
    }

    getNodeWidth( pos, prev, _attr ) {
        if (pos.isOffshoot && prev) return prev.attr.width;
        if (pos.branchNum == 1) return this.rng.range( .2, .3 );
        return this.rng.range( .4, .6 );
    }
    getSegmentLength( pos, _prev, _attr ) {
        if (pos.branchNum == 1) return this.rng.range( .2, .8 );
        return this.rng.range( .5, 1.5 );
    }
    getSegmentAngle( pos, prev, _attr ) {
        return plantHelper.nextAngle( this.rng, pos, prev, 8, true );
    }

    getSegmentStyle( _node0, _node1 ) {
        return this.segmentStyle;
    }

    getLeaves( _n0, n1 ) {
        if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];

        return plantHelper.repeat( this.rng, { from: -75, to: 75, step: 10 }, .5, angle => {
            const av = this.rng.range( -5, 5 );
            const sv = this.rng.range( -.7, .7 );

            return {
                angle: n1.attr.angle + angle + av,
                length: 3.5 + sv,
                handles: this.leafCurveHandles,
                style: this.leafStyle,

                xOffset: this.rng.range( -.2, .2 ),
                yOffset: this.rng.range( .8, .95 ),
            };
        });
    }
};

export { DragonTreeGenus };