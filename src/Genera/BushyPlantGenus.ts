import { BaseGenus } from "./BaseGenus";
import { plantHelper, node, nodePos, nodeAttr } from "../util/util";
import { rngSeed, Genus, leafDefinition } from '../types';

class BushyPlantGenus extends BaseGenus implements Genus {

    constructor( rngSeed?: rngSeed ) {
        super( rngSeed );

        this.width = 6.1;
        this.height = 6.6;
        this.maxBranchNum = 3;

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
            bottomAngle: 60,
            bottomLength: .6,
            topAngle: 179,
            topLength: .2,
        };
    }

    getRoots() {
        return [
            {
                n: this.rng.intRange( 4, 6 ),
                attr: plantHelper.rootPosAngle( this.rng, .5, 6 ),
            },
        ];
    }
    getOffshoots( node: node ) {
        if (node.pos.isLast || node.pos.num==0) return [];

        const p = .5 * (.5 + .5 * node.pos.numFactor) * (.5 + .5 * node.pos.branchFactor);
        const a = [];

        const getNodeCount = () => 4 - node.pos.branchNum - this.rng.test( .6, 1, 0 );

        if (this.rng.test( p )) a.push({
            n: getNodeCount(),
            attr: {
                segmentAngle: node.attr.angle + this.rng.range( 25, 60 ),
            }
        });

        if (this.rng.test( p )) a.push({
            n: getNodeCount(),
            attr: {
                segmentAngle: node.attr.angle + this.rng.range( -60, -25 ),
            }
        });

        return a;
    }

    getNodeWidth( pos: nodePos, prev: node | null, _attr: nodeAttr ) {
        if (pos.isOffshoot && prev) return prev.attr.width;
        return .1 * (.1 + .9 * pos.branchFactor);
    }
    getSegmentLength( pos: nodePos, prev: node | null, _attr: nodeAttr ) {
        if (!prev) return 1;
        if (!pos.isOffshoot && pos.branchNum>0) return prev.attr.length * .75;
        if (!pos.isOffshoot) return prev.attr.length;

        const f = .2 + .8 * (prev.branchRoot.prev ? prev.branchRoot.prev.pos.numFactor : 1);
        return prev.attr.length * f;
    }
    getSegmentAngle( pos: nodePos, prev: node, _attr: nodeAttr ) {
        if (pos.branchNum>0) return plantHelper.nextAngle( this.rng, pos, prev, 16, true );
        return plantHelper.nextAngle( this.rng, pos, prev, 8, true );
    }

    getSegmentStyle( _n0: node, _n1: node ) {
        return this.segmentStyle;
    }

    getLeaves( _n0: node, n1: node ) {
        if (n1.pos.branchNum==0 && n1.pos.num<2) return [];

        const leaves: leafDefinition[] = [];

        const addLeaf = (avf: number) => {
            leaves.push({
                angle: n1.attr.angle + (avf ? (avf * this.rng.range( 20, 40 )) : this.rng.range( -10, 10 )),
                length: this.rng.range( .5, .75 ),
                handles: this.leafCurveHandles,
                style: this.leafStyle,

                xOffset: avf ? -avf * this.rng.range( 0, .5) : 0,
                yOffset: avf ? this.rng.range( .3, .7 ) : .95,
            });
        };

        if (n1.pos.isLast && this.rng.test( .5 )) addLeaf( 0 );

        if (this.rng.test( .5 )) addLeaf( 1 );
        if (this.rng.test( .5 )) addLeaf( -1 );

        return leaves;
    }
};

export { BushyPlantGenus };