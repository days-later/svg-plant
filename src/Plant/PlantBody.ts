import { ProcTree, html, math, BBox, node, nodePos, nodeAttr, offshoot } from "../util/util";
import { bezierCurveBoundingBox } from "../util/bezierCurveBoundingBox";
import { point, attributeSet, leafCurvesHandles, leafDefinition, pathDescriptionSegment, Genus } from '../types';

const precision = 10000;
function prc(v: number): number;
function prc(v: point): point;
function prc(v: number | point): number | point {
    if (Array.isArray( v )) return [
        Math.round( v[0] * precision ),
        Math.round( v[1] * precision ),
    ];

    return Math.round( v * precision );
}

interface PlantPart {
    base: point;
    top: point;

    angle: number;
    length: number;

    ageOffset: number;
    style: attributeSet;

    bbox: BBox;

    getPoints( age: number ): pathDescriptionSegment[] | undefined;
};
class BranchSegment implements PlantPart {
    base: point;
    top: point;

    bottomWidth: number;
    topWidth: number;

    angle: number;
    bottomAngle: number;
    topAngle: number;

    length: number;

    ageOffset: number;
    style: attributeSet;

    bbox: BBox;

    constructor( base: point, style: attributeSet, n0: node, n1: node ) {
        this.base = base;

        this.bottomWidth = n0.attr.width;
        this.topWidth = n1.attr.width;

        this.angle = n0.attr.segmentAngle !== undefined ? n0.attr.segmentAngle : n0.attr.angle;
        this.bottomAngle = n0.attr.angle;
        this.topAngle = n1.attr.angle;

        this.length = n0.attr.length;

        this.top = math.fromAngle( this.base, this.angle, this.length );

        this.ageOffset = n0.attr.totalLength;
        this.style = style;

        this.bbox = this.getBoundingBox();
    }

    getPoints( age: number ): pathDescriptionSegment[] | undefined {
        const ageFactor = this.getAgeFactor( age );
        if (!ageFactor) return;

        let top = this.top;
        if (ageFactor < 1) {
            top = math.fromAngle( this.base, this.angle, this.length * ageFactor );
        }

        const r = math.rectFromLine(
            this.base, top,
            this.bottomAngle, this.topAngle,
            this.bottomWidth, this.topWidth,
            precision,
        );

        return [
            'M', r[0],
            'L', r[1],
            'L', r[2],
            'L', r[3],
            'Z'
        ];
    }

    private getBoundingBox(): BBox {
        const points = math.rectFromLine(
            this.base, this.top,
            this.bottomAngle, this.topAngle,
            this.bottomWidth, this.topWidth,
            undefined
        );

        const bb = new BBox();
        bb.addPoint( points[0][0], points[0][1] );
        bb.addPoint( points[1][0], points[1][1] );
        bb.addPoint( points[2][0], points[2][1] );
        bb.addPoint( points[3][0], points[3][1] );

        return bb;
    }

    private getAgeFactor( age: number ): number {
        if (age <= this.ageOffset) return 0;
        if (age >= this.ageOffset + this.length) return 1;
        return (age - this.ageOffset) / this.length;
    }

    getOffsetPoint( x: number, y: number ): point {
        if (!x) {
            if (!y) return this.base;
            if (y==1) return this.top;
            return math.fromAngle( this.base, this.angle, this.length * y );
        }

        const dir = this.angle < 0 ? 1 : -1;

        if (!y) {
            return math.fromAngle( this.base, this.bottomAngle + 90*dir, this.bottomWidth/2 * x );
        }

        if (y==1) {
            return math.fromAngle( this.top, this.topAngle + 90*dir, this.topWidth/2 * x );
        }

        const l1 = [
            math.fromAngle( this.base, this.bottomAngle + 90*dir, this.bottomWidth/2 ),
            math.fromAngle( this.top, this.topAngle + 90*dir, this.topWidth/2 )
        ];
        const l2 = [
            math.fromAngle( this.base, this.bottomAngle + 90*dir, -this.bottomWidth/2 ),
            math.fromAngle( this.top, this.topAngle + 90*dir, -this.topWidth/2 )
        ];
        const l3 = [
            math.pointOnLine( l1[0], l1[1], y ),
            math.pointOnLine( l2[0], l2[1], y ),
        ];

        x = 1 - (x/2 + .5);

        return math.pointOnLine( l3[0], l3[1], x );
    }
}
class Leaf implements PlantPart {
    base: point;
    pBase: point;
    top: point;

    angle: number;
    length: number;
    handles: leafCurvesHandles;

    ageOffset: number;
    style: attributeSet;

    bbox: BBox;

    constructor( segment: BranchSegment, { angle, length, handles, style, xOffset, yOffset }: leafDefinition ) {
        const base = segment.getOffsetPoint( xOffset, yOffset );
        this.base = base;
        this.pBase = prc( base );

        this.angle = angle;
        this.length = length;
        this.handles = handles;

        this.top = math.fromAngle( base, angle, length );

        this.ageOffset = segment.ageOffset + segment.length * yOffset;

        this.style = style;

        this.bbox = this.getBoundingBox();
    }

    getPoints( age: number ): pathDescriptionSegment[] | undefined {
        const ageFactor = this.getAgeFactor( age );
        if (!ageFactor) return;

        let top = this.top;
        if (ageFactor < 1) {
            top = math.fromAngle( this.base, this.angle, this.length * ageFactor );
        }

        const curves = this.getCurves({ top, ageFactor, precision });

        top = prc( top );

        return [
            'M', this.pBase,
            'C', curves.up[0], curves.up[1], top,
            'C', curves.down[0], curves.down[1], this.pBase
        ];
    }

    private getBoundingBox(): BBox {
        const c = this.getCurves({ top: this.top, ageFactor: 1 });
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

        if (typeof this.style['stroke-width'] == 'number') bb.expand( this.style['stroke-width'] / 2 );

        return bb;
    }

    private getCurves(
        { top, ageFactor, precision }: { top: point; ageFactor: number; precision?: number; }
    ): { up: [ point, point ], down: [ point, point ] } {
        const bha = this.handles.bottomAngle;
        const bhl = this.handles.bottomLength * ageFactor;
        const tha = this.handles.topAngle;
        const thl = this.handles.topLength * ageFactor;

        return {
            up: [
                math.fromAngle( this.base, this.angle + bha, this.length * bhl, precision ),
                math.fromAngle( top, this.angle + tha, this.length * thl, precision ),
            ],
            down: [
                math.fromAngle( top, this.angle - tha, this.length * thl, precision ),
                math.fromAngle( this.base, this.angle - bha, this.length * bhl, precision ),
            ],
        };
    }

    private getAgeFactor( age: number ): number {
        if (age <= this.ageOffset) return 0;
        if (age >= this.ageOffset + this.length) return 1;
        return (age - this.ageOffset) / this.length;
    }
}

class Branches {
    segments: BranchSegment[][];
    leaves: Leaf[][];

    constructor() {
        this.segments = [];
        this.leaves = [];
    }

    addSegment( branchNum: number, segment: BranchSegment ) {
        let branch = this.segments[ branchNum ];
        if (!branch) {
            branch = [];
            this.segments[ branchNum ] = branch;
        }
        branch.push( segment );
    }
    addLeaf( branchNum: number, leaf: Leaf ) {
        let branch = this.leaves[ branchNum ];
        if (!branch) {
            branch = [];
            this.leaves[ branchNum ] = branch;
        }
        branch.push( leaf );
    }

    getArray(): PlantPart[] {
        let ret: PlantPart[] = [];
        for (let i=0; i<this.segments.length; i++) {
            ret = ret.concat( this.segments[ i ] || [] );
            ret = ret.concat( this.sortLeaves( this.leaves[ i ] ) );
        }

        return ret;
    }

    sortLeaves( a: Leaf[] ): Leaf[] {
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
    genus: Genus;

    bbox: BBox;
    yFactor: number;

    private parts: PlantPart[] | undefined;
    private maxAge: number;

    constructor( genus: Genus ) {
        this.genus = genus;
        this.bbox = new BBox;

        this.maxAge = 0;
        this.yFactor = 1;
    }

    private getTree() {
        const getNodeAttr = ( pos: nodePos, prev: node | null, attr: nodeAttr ): nodeAttr => {
            return {
                width: this.genus.getNodeWidth( pos, prev, attr ),
                angle: prev ? this.genus.getSegmentAngle( pos, prev, attr ) : 0,
                length: pos.isLast ? (prev ? prev.attr.length : 0) : this.genus.getSegmentLength( pos, prev, attr ),
                totalLength: prev ? ((pos.isOffshoot ? 0 : prev.attr.length) + prev.attr.totalLength) : 0,
            };
        };
        const getOffshoots = (node: node | null): offshoot[] => {
            if (node === null) return this.genus.getRoots();
            return this.genus.getOffshoots( node );
        };

        return new ProcTree( this.genus.maxBranchNum, getNodeAttr, getOffshoots );
    }

    init(): void {
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
        const points = new Map;
        let maxAge = 0;

        const getBasePoint = (node: node): point => {
            if (!node.prev) {
                const p: point = [ node.attr.x || 0, 0 ];
                this.bbox.addPoint( p[0], p[1] );
                return p;
            }
            else if (node.pos.isOffshoot) {
                const p = points.get( node.prev );
                if (p) return p;

                const rp: point = [ node.prev.attr.x || 0, 0 ];
                points.set( node.prev, rp );
                this.bbox.addPoint( rp[0], rp[1] );
                return rp;
            }

            return points.get( node );
        }

        tree.eachSegment( (n0: node, n1: node): void => {

            const base = getBasePoint( n0 );
            const style = this.genus.getSegmentStyle( n0, n1 );
            const s = new BranchSegment( base, style, n0, n1 );

            points.set( n1, s.top );
            this.bbox.addBBox( s.bbox );
            branches.addSegment( n0.pos.branchNum, s );

            this.genus.getLeaves( n0, n1 ).map( (cfg: leafDefinition): void => {
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

    private render( age: number, colors=true, svg: SVGElement ): void {
        age *= this.maxAge;

        if (this.parts) for (const p of this.parts) {
            const points = p.getPoints( age );
            if (!points) continue;

            let style = {} as attributeSet, add = {} as attributeSet;

            if (colors) {
                style = p.style;
                add = {};
                if (typeof style['stroke-width'] == 'number') add['stroke-width'] = prc( style['stroke-width'] );
            }

            const set = Object.assign( {}, style, add, {
                d: html.svg.compilePathDescription( points ),
            });
            svg.appendChild( html.svg.node( 'path', set ) );
        }
    }

    getSvg( age: number, colors: boolean ): SVGElement {
        if (this.parts === undefined) this.init();

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