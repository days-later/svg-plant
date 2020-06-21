import { rng, nodePos, nodeAttr, offshoot, node } from "../util/util";
import { rngSeed, attributeSet, leafCurvesHandles, leafDefinition, Genus } from '../types';

class BaseGenus implements Genus {

    rng: rng;
    width: number;
    height: number;
    maxBranchNum: number;

    segmentStyle: attributeSet;
    leafStyle: attributeSet;
    leafCurveHandles: leafCurvesHandles;

    constructor( rngSeed?: rngSeed ) {
        this.rng = rng( rngSeed );

        this.width = 4;
        this.height = 4;
        this.maxBranchNum = 1;

        this.segmentStyle = {
            fill: '#161',
            stroke: '#041',
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

    static get genusName(): string {
        const cn = this.name;
        return cn.substring( 0, cn.length - 5 );
    }
    get genusName(): string {
        const cn = this.constructor.name;
        return cn.substring( 0, cn.length - 5 );
    }
    get rngSeed(): string {
        return this.rng.seed;
    }
    reset(): void {
        this.rng.reset();
    }

    getRoots(): offshoot[] {
        return [
            {
                n: 3,
                attr: { x: 0, segmentAngle: 0 }
            },
        ];
    }
    getOffshoots( node: node ): offshoot[] {
        if (node.pos.isLast || node.pos.num==0) return [];

        return [
            {
                n: 1,
                attr: { segmentAngle: node.attr.angle - 60 }
            },
            {
                n: 1,
                attr: { segmentAngle: node.attr.angle + 60 }
            },
        ];
    }

    getNodeWidth( _pos: nodePos, _prev: node | null, _attr: nodeAttr ): number {
        return .1;
    }
    getSegmentLength( _pos: nodePos, _prev: node | null, _attr: nodeAttr ) {
        return 1;
    }
    getSegmentAngle( pos: nodePos, prev: node, _attr: nodeAttr ) {
        if (pos.isOffshoot) return prev.attr.angle;
        return prev.attr.segmentAngle !== undefined ? prev.attr.segmentAngle : prev.attr.angle;
    }

    getSegmentStyle( _n0: node, _n1: node ): attributeSet {
        return this.segmentStyle;
    }

    getLeaves( _n0: node, n1: node ): leafDefinition[] {
        if (!n1.pos.isLast) return [];

        return [
            {
                angle: n1.attr.angle,
                length: 1,
                handles: this.leafCurveHandles,
                style: this.leafStyle,

                xOffset: 0,
                yOffset: .95,
            }
        ];
    }
};

export { BaseGenus };