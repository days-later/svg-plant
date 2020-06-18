import { rng } from "../util/util";

class BaseGenus {

    constructor( rngSeed ) {
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

    static get genusName() {
        const cn = this.name;
        return cn.substring( 0, cn.length - 5 );
    }
    get genusName() {
        const cn = this.constructor.name;
        return cn.substring( 0, cn.length - 5 );
    }
    get rngSeed() {
        return this.rng.seed;
    }
    reset() {
        this.rng.reset();
    }

    getRoots() {
        return [
            {
                n: 3,
                attr: { x: 0, segmentAngle: 0 }
            },
        ];
    }
    getOffshoots( node ) {
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

    getNodeWidth( _pos, _prev, _attr ) {
        return .1;
    }
    getSegmentLength( _pos, _prev, _attr ) {
        return 1;
    }
    getSegmentAngle( pos, prev, _attr ) {
        if (pos.isOffshoot) return prev.attr.angle;
        return prev.attr.segmentAngle !== undefined ? prev.attr.segmentAngle : prev.attr.angle;
    }

    getSegmentStyle( _node0, _node1 ) {
        return this.segmentStyle;
    }

    getLeaves( _n0, n1 ) {
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