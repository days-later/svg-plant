import { BaseGenus } from "./BaseGenus";
import { plantHelper, node, offshoot, nodePos, nodeAttr } from "../util/util";
import type { Genus, rngSeed, leafDefinition } from '../types';

class DragonTreeGenus extends BaseGenus implements Genus {

    constructor( rngSeed?: rngSeed ) {
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
    getOffshoots( node: node ) {
        if (!node.pos.isLast) return [];

        const p = .75;
        const steps = { from: -60, to: 60, step: 30 };
        const makeOffshoot = (angle: number): offshoot => {
            return {
                n: 2,
                attr: {
                    segmentAngle: node.attr.angle + angle + this.rng.range( -10, 10 ),
                }
            };
        };
        const offshoots = plantHelper.repeat({ rng: this.rng, steps, p, cb: makeOffshoot });

        if (!offshoots.length) offshoots.push({
            n: 2,
            attr: {
                segmentAngle: this.rng.range( -60, 60 ),
            }
        });

        return offshoots;
    }

    getNodeWidth( pos: nodePos, prev: node, _attr: nodeAttr ) {
        if (pos.isOffshoot && prev) return prev.attr.width;
        if (pos.branchNum == 1) return this.rng.range( .2, .3 );
        return this.rng.range( .4, .6 );
    }
    getSegmentLength( pos: nodePos, _prev: node, _attr: nodeAttr ) {
        if (pos.branchNum == 1) return this.rng.range( .2, .8 );
        return this.rng.range( .5, 1.5 );
    }
    getSegmentAngle( pos: nodePos, prev: node, _attr: nodeAttr ) {
        return plantHelper.nextAngle( this.rng, pos, prev, 8, true );
    }

    getSegmentStyle( _n0: node, _n1: node ) {
        return this.segmentStyle;
    }

    getLeaves( _n0: node, n1: node ) {
        if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];

        const steps = { from: -75, to: 75, step: 10 };
        const p = .5;
        const makeLeaf = (angle: number): leafDefinition => {
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
        };
        return plantHelper.repeat({ rng: this.rng, steps, p, cb: makeLeaf });
    }
};

export { DragonTreeGenus };
