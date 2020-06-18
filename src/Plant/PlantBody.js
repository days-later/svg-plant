import { ProcTree, html, math, BBox } from "../util/util";
import { bezierCurveBoundingBox } from "../util/bezierCurveBoundingBox";

const precision = 10000;
const prc = v => {
    if (v.length) return [
        Math.round( v[0] * precision ),
        Math.round( v[1] * precision ),
    ];

    return Math.round( v * precision );
}

class BranchSegment {

    constructor( base, style, n0, n1 ) {
        this.base = base;

        this.bottomWidth = n0.attr.width;
        this.topWidth = n1.attr.width;

        this.angle = n0.attr.segmentAngle !== undefined ? n0.attr.segmentAngle : n0.attr.angle;
        this.bottomAngle = n0.attr.angle;
        this.topAngle = n1.attr.angle;

        this.length = n0.attr.length;

        this.top = math.fromAngle( this.angle, this.length, this.base[0], this.base[1] );

        this.ageOffset = n0.attr.totalLength;
        this.branchNum = n0.pos.branchNum;

        this.style = style;

        this.bbox = this.getBoundingBox();
    }

    getPoints( age ) {
        const ageFactor = this.getAgeFactor( age );
        if (!ageFactor) return;

        let top = this.top;
        if (ageFactor < 1) {
            top = math.fromAngle( this.angle, this.length * ageFactor, this.base[0], this.base[1] );
        }

        return math.rectFromLine(
            this.base, top,
            this.bottomAngle, this.topAngle,
            this.bottomWidth, this.topWidth,
            precision,
        );
    }

    getBoundingBox() {
        const points = math.rectFromLine(
            this.base, this.top,
            this.bottomAngle, this.topAngle,
            this.bottomWidth, this.topWidth,
            false
        );

        const bb = new BBox();
        bb.addPoint( points[0][1], points[0][2] );
        bb.addPoint( points[1][1], points[1][2] );
        bb.addPoint( points[2][1], points[2][2] );
        bb.addPoint( points[3][1], points[3][2] );

        return bb;
    }

    getAgeFactor( age ) {
        if (age <= this.ageOffset) return 0;
        if (age >= this.ageOffset + this.length) return 1;
        return (age - this.ageOffset) / this.length;
    }

    getOffsetPoint( x, y ) {
        if (!x) {
            if (!y) return this.base;
            if (y==1) return this.top;
            return math.fromAngle( this.angle, this.length * y, this.base[0], this.base[1] );
        }

        const dir = this.angle < 0 ? 1 : -1;

        if (!y) {
            return math.fromAngle( this.bottomAngle + 90*dir, this.bottomWidth/2 * x, this.base[0], this.base[1] );
        }

        if (y==1) {
            return math.fromAngle( this.topAngle + 90*dir, this.topWidth/2 * x, this.top[0], this.top[1] );
        }

        const l1 = [
            math.fromAngle( this.bottomAngle + 90*dir, this.bottomWidth/2, this.base[0], this.base[1] ),
            math.fromAngle( this.topAngle + 90*dir, this.topWidth/2, this.top[0], this.top[1] )
        ];
        const l2 = [
            math.fromAngle( this.bottomAngle + 90*dir, -this.bottomWidth/2, this.base[0], this.base[1] ),
            math.fromAngle( this.topAngle + 90*dir, -this.topWidth/2, this.top[0], this.top[1] )
        ];
        const l3 = [
            math.pointOnLine( l1[0], l1[1], y ),
            math.pointOnLine( l2[0], l2[1], y ),
        ];

        x = 1 - (x/2 + .5);

        return math.pointOnLine( l3[0], l3[1], x );
    }
}

class Leaf {

    constructor( segment, { angle, length, handles, style, xOffset, yOffset } ) {
        const base = segment.getOffsetPoint( xOffset, yOffset );
        this.base = base;
        this.pBase = prc( base );

        this.angle = angle;
        this.length = length;
        this.handles = handles;

        this.top = math.fromAngle( angle, length, base[0], base[1] );

        this.ageOffset = segment.ageOffset + segment.length * yOffset;

        this.style = style;

        this.bbox = this.getBoundingBox();
    }

    getPoints( age ) {
        const ageFactor = this.getAgeFactor( age );
        if (!ageFactor) return;

        let top = this.top;
        if (ageFactor < 1) {
            top = math.fromAngle( this.angle, this.length * ageFactor, this.base[0], this.base[1] );
        }

        const curves = this.getCurves( top, ageFactor, precision );

        top = prc( top );

        return [
            'M', this.pBase,
            'C', curves.up[0], curves.up[1], top,
            'C', curves.down[0], curves.down[1], this.pBase
        ];
    }

    getBoundingBox() {
        const c = this.getCurves( this.top, 1, false );
        const bb = new BBox(bezierCurveBoundingBox(
            this.base[0], this.base[1],
            c.up[0][0], c.up[0][1],
            c.up[1][0], c.up[1][1],
            this.top[0], this.top[1],
        ));

        bb.addBBox(bezierCurveBoundingBox(
            this.top[0], this.top[1],
            c.down[0][0], c.down[0][1],
            c.down[1][0], c.down[1][1],
            this.base[0], this.base[1],
        ));

        if (this.style['stroke-width']) bb.expand( this.style['stroke-width'] / 2 );

        return bb;
    }

    getCurves( top, ageFactor, precision ) {
        const bha = this.handles.bottomAngle;
        const bhl = this.handles.bottomLength * ageFactor;
        const tha = this.handles.topAngle;
        const thl = this.handles.topLength * ageFactor;

        return {
            up: [
                math.fromAngle( this.angle + bha, this.length * bhl, this.base[0], this.base[1], '', precision ),
                math.fromAngle( this.angle + tha, this.length * thl, top[0], top[1], '', precision ),
            ],
            down: [
                math.fromAngle( this.angle - tha, this.length * thl, top[0], top[1], '', precision ),
                math.fromAngle( this.angle - bha, this.length * bhl, this.base[0], this.base[1], '', precision ),
            ],
        };
    }

    getAgeFactor( age ) {
        if (age <= this.ageOffset) return 0;
        if (age >= this.ageOffset + this.length) return 1;
        return (age - this.ageOffset) / this.length;
    }
}

class Branches {
    constructor() {
        this.segments = [];
        this.leaves = [];
    }

    addSegment( branchNum, segment ) {
        let branch = this.segments[ branchNum ];
        if (!branch) {
            branch = [];
            this.segments[ branchNum ] = branch;
        }
        branch.push( segment );
    }
    addLeaf( branchNum, leaf ) {
        let branch = this.leaves[ branchNum ];
        if (!branch) {
            branch = [];
            this.leaves[ branchNum ] = branch;
        }
        branch.push( leaf );
    }

    getArray() {
        let ret = [];
        for (let i=0; i<this.segments.length; i++) {
            ret = ret.concat( this.segments[ i ] || [] );
            ret = ret.concat( this.sortLeaves( this.leaves[ i ] ) );
        }

        return ret;
    }

    sortLeaves( a ) {
        if (!a) return [];

        return a.sort((l0,l1) => {
            if (l1.bbox.containsPoint( l0.base[0], l0.base[1], true )) {
                return -1;
            }

            if (l0.bbox.containsPoint( l1.base[0], l1.base[1], true )) {
                return 1;
            }

            const d0 = math.distance( l0.base, [0,0] );
            const d1 = math.distance( l1.base, [0,0] );
            return d1 - d0;
        });
    }
}

class PlantBody {

    constructor( genus ) {
        this.genus = genus;
    }

    init() {
        this.genus.reset();

        const tree = this.getTree();
        tree.grow();

        this.bbox = new BBox({
            x0: -this.genus.width/2,
            x1: this.genus.width/2,
            y0: -this.genus.height,
            y1: 0,
        });

        const branches = new Branches;
        const points = new Map();
        let maxAge = 0;

        const getBasePoint = node => {
            if (!node.prev) {
                const p = [ node.attr.x || 0, 0 ];
                this.bbox.addPoint( p[0], p[1] );
                return p;
            }
            else if (node.pos.isOffshoot) {
                const p = points.get( node.prev );
                if (p) return p;

                const rp = [ node.prev.attr.x || 0, 0 ];
                points.set( node.prev, rp );
                this.bbox.addPoint( rp[0], rp[1] );
                return rp;
            }

            return points.get( node );
        }

        tree.eachSegment( (n0,n1) => {

            const base = getBasePoint( n0 );
            const style = this.genus.getSegmentStyle( n0, n1 );
            const s = new BranchSegment( base, style, n0, n1 );

            points.set( n1, s.top );
            this.bbox.addBBox( s.bbox );
            branches.addSegment( n0.pos.branchNum, s );

            this.genus.getLeaves( n0, n1 ).map( (cfg, i) => {
                const leaf = new Leaf( s, cfg );

                this.bbox.addBBox( leaf.bbox );
                branches.addLeaf( n0.pos.branchNum, leaf );

                if (leaf.ageOffset + leaf.length > maxAge) maxAge = leaf.ageOffset + leaf.length;
            });

            if (n1.attr.totalLength > maxAge) maxAge = n1.attr.totalLength;

        });

        this.parts = branches.getArray();
        this.maxAge = maxAge;

        // make sure the plant is centered
        const bboxX = Math.max( Math.abs( this.bbox.x0 ), Math.abs( this.bbox.x1 ) );
        this.bbox.x0 = -bboxX;
        this.bbox.x1 = bboxX;

        this.yFactor = (this.bbox.height / -this.bbox.y0) || 1;
    }

    getTree() {
        const getNodeAttr = ( pos, prev, attr ) => {
            return {
                width: this.genus.getNodeWidth( pos, prev, attr ),
                angle: prev ? this.genus.getSegmentAngle( pos, prev, attr ) : 0,
                length: pos.isLast ? (prev ? prev.attr.length : 0) : this.genus.getSegmentLength( pos, prev, attr ),
                totalLength: prev ? ((pos.isOffshoot ? 0 : prev.attr.length) + prev.attr.totalLength) : 0,
            };
        };
        const getOffshoots = node => {
            if (!node) return this.genus.getRoots();
            return this.genus.getOffshoots( node );
        };

        return new ProcTree( this.genus.maxBranchNum, getNodeAttr, getOffshoots );
    }

    render( age, colors=true, svg ) {
        age *= this.maxAge;

        if (1 || colors) {
            for (const p of this.parts) {
                const points = p.getPoints( age );
                if (!points) continue;

                let style = {}, add = {};

                if (colors) {
                    style = p.style;
                    add = {};
                    if (style['stroke-width']) add['stroke-width'] = prc( style['stroke-width'] );
                }

                const set = Object.assign( {}, style, add, {
                    d: html.svg.compilePathDescription( points ),
                });
                svg.appendChild( html.svg.node( 'path', set ) );
            }
        }
        else {
            let allPoints = [];
            for (const p of this.parts) {
                const points = p.getPoints( age );
                if (points) allPoints = allPoints.concat( points );
            }
            const set = {
                d: html.svg.compilePathDescription( allPoints )
            };
            svg.appendChild( html.svg.node( 'path', set ) );
        }
    }

    getSvg( age, colors ) {
        if (!this.segments) this.init();

        const svg = html.svg.root({
            class: 'svg-plant-body',
            viewBox: this.bbox.withPrecision( precision ).viewBox,
            preserveAspectRatio: 'xMidYMax meet',
        });

        this.render( age, colors, svg );

        return svg;
    }
}

export { PlantBody };