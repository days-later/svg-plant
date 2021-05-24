import seedrandom from 'seedrandom';
import type { attributeSet, pathDescriptionSegment, point, rngSeed } from '../types';

const html = {
    node( tag: string, set?: attributeSet ): Element {
        const node = document.createElement( tag );
        html.attr( node, set );
        return node;
    },
    nodeNS( tag: string, set: attributeSet, ns: string ): Element {
        const node = document.createElementNS( ns, tag );
        html.attr( node, set );
        return node;
    },
    attr( node: Element, set: attributeSet = {} ): void {
        for (let name in set) node.setAttribute( name, String( set[ name ] ) );
    },

    svg: {
        root( set?: attributeSet ): SVGElement {
            const svg = <SVGElement>html.svg.node( 'svg', set );
            svg.setAttribute( 'xmlns', "http://www.w3.org/2000/svg" );
            svg.setAttributeNS( "http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink" );
            return svg;
        },
        node( tag: string, set?: attributeSet ): SVGElement {
            const el = <SVGElement>html.nodeNS( tag, {}, "http://www.w3.org/2000/svg" );
            html.attr( el, set );
            return el;
        },

        compilePathDescription( points: pathDescriptionSegment[] ): string {
            const d = [];

            for (const p of points) {
                if (p.length == 1) d.push( p );
                else if (p.length == 2) d.push( p[0], p[1] );
                else if (p.length == 3) d.push( p[0], p[1], p[2] );
            }

            return d.join( ' ' );
        }
    },
};

const math = {
    toRadians( degrees: number ): number {
        return degrees * (Math.PI / 180);
    },

    fromAngle( point: point, angle: number, length: number, precision?:number ): point {
        const a: point = [
            Math.sin( math.toRadians( angle ) ) * length + point[0],
            - Math.cos( math.toRadians( angle ) ) * length + point[1],
        ];

        if (precision) {
            a[ 0 ] = Math.round( a[ 0 ] * precision );
            a[ 1 ] = Math.round( a[ 1 ] * precision );
        }

        return a;
    },

    rectFromLine(
        pointBottom: point, pointTop: point,
        angleBottom: number, angleTop: number,
        widthBottom: number, widthTop: number,
        precision?: number
    ): [ point, point, point, point ] {
        widthBottom /= 2;
        widthTop /= 2;
        return [
            math.fromAngle( pointBottom, angleBottom - 90, widthBottom, precision ),
            math.fromAngle( pointTop, angleTop - 90, widthTop, precision ),
            math.fromAngle( pointTop, angleTop + 90, widthTop, precision ),
            math.fromAngle( pointBottom, angleBottom + 90, widthBottom, precision )
        ];
    },

    pointOnLine( p1: point, p2: point, d: number ): point {
        return [
            p1[0] + d * (p2[0] - p1[0]),
            p1[1] + d * (p2[1] - p1[1]),
        ];
    },

    distance( p1: point, p2: point ): number {
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        return Math.sqrt( dx*dx + dy*dy );
    }
};

const plantHelper = {
    rootPosAngle( rng: rng, xMax: number, maxAngle: number ) {
        const x = rng.range( -xMax, xMax );
        const f = Math.abs( x ) / xMax;
        return {
            x,
            segmentAngle: maxAngle * f * (x < 0 ? -1 : 1),
        };
    },

    segmentAngle( baseNode: node ): number {
        if (baseNode.attr.segmentAngle !== undefined) return baseNode.attr.segmentAngle;
        return baseNode.attr.angle;
    },

    nextAngle( rng: rng, pos: nodePos, prevNode: node, variance: number, alternate: boolean ): number {
        if (pos.isOffshoot) return prevNode.attr.angle;

        const pa = this.segmentAngle( prevNode );

        if (alternate) {
            const dir = pos.branchNum>0 ? 1 : prevNode.treeRoot.attr.x>=0 ? 1 : -1;
            return pa + (prevNode.pos.num % 2 ? 1 : -1) * rng.range( 0, variance ) * dir;
        }
        else {
            return pa + rng.range( -variance, variance );
        }
    },

    archingBranchAngle( rng: rng, pos: nodePos, prevNode: node, variance: number, numAdjust: number ): number {
        if (pos.isOffshoot) return prevNode.attr.angle;

        const pa = plantHelper.segmentAngle( prevNode );
        const base = prevNode.branchRoot.attr.branchArchAngle;
        const f = numAdjust ? (1 - numAdjust) + numAdjust * (1 - pos.numFactor) : 1;

        return pa + f * base + rng.range( -variance, variance );
    },

    repeat<T,U=number>(
        { rng, cb, p=1, shuffle=true, steps, values, n }:
        {
            rng: rng,
            cb: ( i: number | U ) => T,
            steps?: { from: number, to: number, step: number },
            values?: U[],
            n?: number | [ number, number ],
            p?: number, shuffle?: boolean
        }
    ): T[] {
        const a: T[] = [];

        if (p <= 0) return a;
        const test = p < 1;

        if (values !== undefined) {
            for (let v of values) if (!test || rng.test( p )) {
                a.push( cb( v ) );
            }
        }
        else if (steps !== undefined) {
            for (let i=steps.from; i<=steps.to; i+=steps.step) if (!test || rng.test( p )) {
                a.push( cb( i ) );
            }
        }
        else if (n !== undefined) {
            if (Array.isArray( n )) n = rng.intRange( n[0], n[1] );

            for (let i=0; i<n; i++) if (!test || rng.test( p )) {
                a.push( cb( i ) );
            }
        }

        if (shuffle) rng.shuffle( a );

        return a;
    }
};

interface rng {
    seed: string;
    reset(): void;
    random( v: number ): number;
    test( p: number ): boolean;
    test<T,U>( p: number, pass: T, fail: U ): T | U;
    test<T,U>( p: number, pass?: T, fail?: U ): T | U | boolean;
    range( v0: number, v1: number ): number;
    intRange( v0: number, v1: number ): number;
    ranges( ... ranges: Array<[ number, number, number? ]> ): number;
    shuffle( a: Array<any> ): Array<any>;
};
const rng = (seed: rngSeed): rng => {
    const seedStr = (seed === undefined) ? (Math.random() + '').substring( 2 ) : String( seed );
    let fn: ReturnType<seedrandom>;

    const rng = {
        get seed(): string {
            return seedStr;
        },
        reset(): void {
            fn = seedrandom( seedStr );
        },

        random( v=1 ): number {
            return fn() * v;
        },
        test<T,U>( p=.5, pass?: T, fail?: U ): T | U | boolean {
            const r = p >= 1 ? true : p <= 0 ? false : fn() < p;
            if (r) return pass === undefined ? true : pass;
            return fail === undefined ? false : fail;
        },
        range( v0: number, v1: number ): number {
            if (v0==v1) return v0;
            return v0 + fn() * ( v1 - v0 );
        },
        intRange( v0: number, v1: number ): number {
            if (v0==v1) return v0;
            return v0 + Math.floor( fn() * ( v1 - v0 + 1 ) );
        },
        ranges( ... ranges: Array<[ number, number, number? ]> ): number {
            if (!ranges.length) return 0;

            const ep = 1 / ranges.length;

            ranges = [ ... ranges ];
            const last = ranges.pop();

            for (let r of ranges) {
                const p = r[2] || ep;
                if (rng.test( p )) return rng.range( r[0], r[1] );
            }

            return last ? rng.range( last[0], last[1] ) : 0;
        },

        shuffle( a: Array<any> ): Array<any> {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor( fn() * (i + 1) );
                const tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a;
        }
    };

    rng.reset();

    return rng;
}

interface bboxData {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    [propName: string]: any;
};
class BBox {
    x0: number;
    x1: number;
    y0: number;
    y1: number;

    constructor(data?: bboxData) {
        if (data) {
            this.x0 = data.x0;
            this.x1 = data.x1;
            this.y0 = data.y0;
            this.y1 = data.y1;
        }
        else {
            this.x0 = Infinity;
            this.x1 = -Infinity;
            this.y0 = Infinity;
            this.y1 = -Infinity;
        }
    }

    addX( v: number ): this {
        if (v < this.x0) this.x0 = v;
        if (v > this.x1) this.x1 = v;
        return this;
    }
    addY( v: number ): this {
        if (v < this.y0) this.y0 = v;
        if (v > this.y1) this.y1 = v;
        return this;
    }
    addPoint( x: number, y: number ): this {
        this.addX( x );
        this.addY( y );
        return this;
    }
    addBBox( bbox: bboxData ): this {
        this.addX( bbox.x0 );
        this.addX( bbox.x1 );
        this.addY( bbox.y0 );
        this.addY( bbox.y1 );
        return this;
    }

    expand( v: number ): this {
        this.x0 -= v;
        this.x1 += v;

        this.y0 -= v;
        this.y1 += v;

        return this;
    }

    contains( bbox: bboxData, strict: boolean ): boolean {
        if (strict) return this.x0 < bbox.x0 && this.x1 > bbox.x1 && this.y0 < bbox.y0 && this.y1 > bbox.y1;
        return this.x0 <= bbox.x0 && this.x1 >= bbox.x1 && this.y0 <= bbox.y0 && this.y1 >= bbox.y1;
    }
    containedBy( bbox: bboxData, strict: boolean ): boolean {
        if (strict) return this.x0 > bbox.x0 && this.x1 < bbox.x1 && this.y0 > bbox.y0 && this.y1 < bbox.y1;
        return this.x0 >= bbox.x0 && this.x1 <= bbox.x1 && this.y0 >= bbox.y0 && this.y1 <= bbox.y1;
    }
    containsPoint( x: number, y: number, strict: boolean ): boolean {
        if (strict) return !( x <= this.x0 || x >= this.x1 || y <= this.y0 || y >= this.y1 );
        return !( x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1 );
    }

    clone(): BBox {
        return new BBox( this.data );
    }

    withPrecision( p: number ): BBox {
        return new BBox({
            x0: Math.round( this.x0 * p ),
            x1: Math.round( this.x1 * p ),
            y0: Math.round( this.y0 * p ),
            y1: Math.round( this.y1 * p ),
        });
    }

    get width(): number {
        return this.x1 - this.x0;
    }
    get height(): number {
        return this.y1 - this.y0;
    }

    get aspectRatio(): number {
        if (!this.height) return 0;
        return this.width / this.height;
    }

    get data(): bboxData {
        return {
            x0: this.x0,
            x1: this.x1,
            y0: this.y0,
            y1: this.y1
        };
    }

    get pointsArray(): [ point, point ] {
        return [
            [ this.x0, this.y0 ],
            [ this.x1, this.y1 ],
        ];
    }

    get viewBox(): string {
        return `${this.x0} ${this.y0} ${this.width} ${this.height}`;
    }
}

interface nodePos {
    num: number,
    branchNum: number,

    height: number,
    offshootHeight: number,

    isRoot: boolean,

    isLast: boolean,
    isLastBranch: boolean,

    isOffshoot: boolean,

    numFactor: number,
    branchFactor: number,
};
interface nodeAttr {
    [key: string]: any,
};
interface offshoot {
    n: number,
    attr?: nodeAttr,
};
interface node {
    pos: nodePos,
    attr: nodeAttr,
    offshoots: node[],

    prev: node | null,
    next: node | null,

    branchRoot: node,
    treeRoot: node,

    offshootNum: number,
};
type getNode = (pos: nodePos, prev: node | null, rootAttr: nodeAttr) => nodeAttr;
type getOffshoots = (node: node | null) => offshoot[];
class ProcTree {

    maxBranchNum: number;
    getNode: getNode;
    getOffshoots: getOffshoots;

    private roots: node[];

    constructor( maxBranchNum: number, getNode: getNode, getOffshoots: getOffshoots ) {
        this.maxBranchNum = maxBranchNum;
        this.getNode = getNode;
        this.getOffshoots = getOffshoots;

        this.roots = [];
    }

    grow(): void {
        const roots = this.getOffshoots( null );
        for (let i in roots) this.growBranch( null, Number( i ), roots[ i ].n, roots[ i ].attr || {} );
    }

    growBranch( rootNode: node | null, offshootNum: number, segmentCount: number, attr: nodeAttr ): void {
        const isTreeRoot = !rootNode;

        let node = this.addNode( rootNode, true, offshootNum, segmentCount, attr );

        if (isTreeRoot) this.roots.push( node );
        const isLastBranch = this.maxBranchNum == node.pos.branchNum;

        if (!isLastBranch && isTreeRoot) {
            const offshoots = this.getOffshoots( node );
            for (let i in offshoots) this.growBranch( node, Number( i ), offshoots[ i ].n, offshoots[ i ].attr || {} );
        }

        for (let i=0; i<segmentCount; i++) {
            node = this.addNode( node, false, offshootNum, segmentCount, {} );
            if (!isLastBranch) {
                const offshoots = this.getOffshoots( node );
                for (let i in offshoots) this.growBranch( node, Number( i ), offshoots[ i ].n, offshoots[ i ].attr || {} );
            }
        }
    }

    addNode( prev: node | null, isOffshoot: boolean, offshootNum: number, maxNum: number, rootAttr: nodeAttr ): node {
        const pos = this.getPos( prev ? prev.pos : null, isOffshoot, maxNum );
        const node: node = {
            pos,
            attr: { ... rootAttr, ... this.getNode( pos, prev, rootAttr ) },
            offshoots: [],

            prev: null,
            next: null,

            branchRoot: <node>{},
            treeRoot: <node>{},

            offshootNum: 0,
        };

        if (prev) {
            node.prev = prev;
            node.branchRoot = isOffshoot ? node : prev.pos.isOffshoot ? prev : prev.branchRoot;
            node.treeRoot = prev.treeRoot ? prev.treeRoot : prev;

            if (isOffshoot) {
                prev.offshoots.push( node );
                node.offshootNum = offshootNum;
            }
            else {
                prev.next = node;
            }

        }
        else {
            node.branchRoot = node;
            node.treeRoot = node;
            node.offshootNum = offshootNum;
        }

        return node;
    }

    getPos( prev: nodePos | null, isOffshoot: boolean, maxNum: number ): nodePos {
        if (prev === null) return {
            num: 0,
            branchNum: 0,

            height: 0,
            offshootHeight: 0,

            isRoot: true,

            isLast: maxNum == 0,
            isLastBranch: this.maxBranchNum == 0,

            isOffshoot,

            numFactor: 1,
            branchFactor: 1,
        };

        const pos: nodePos = {
            num: isOffshoot ? 0 : prev.num + 1,
            branchNum: isOffshoot ? prev.branchNum + 1 : prev.branchNum,

            height: isOffshoot ? prev.height : prev.height + 1,
            offshootHeight: isOffshoot ? prev.num : prev.offshootHeight,

            isRoot: false,

            isLast: false,
            isLastBranch: false,

            isOffshoot,

            numFactor: 0,
            branchFactor: 0,
        };

        if (pos.num == maxNum) pos.isLast = true;
        if (pos.branchNum == this.maxBranchNum) pos.isLastBranch = true;

        pos.numFactor = maxNum ? (1 - pos.num / maxNum) : 1;
        pos.branchFactor = this.maxBranchNum ? (1 - pos.branchNum / this.maxBranchNum) : 1;

        return pos;
    }

    eachSegment( cb: (n0: node, n1: node) => void ): void {
        for (let node of this.roots) this._each( node, cb );
    }
    _each( node: node | null, cb: (n0: node, n1: node) => void ): void {
        // note: the treeRoot node can have offshoots
        // other nodes that are branchRoots cannot have offshoots
        while ( node ) {
            if (node.pos.num > 0 && node.prev) cb( node.prev, node );
            for (let offshootNode of node.offshoots) this._each( offshootNode.next, cb );
            node = node.next;
        }
    }
}

export {
    html,
    math,
    plantHelper,
    rng, rng as rngInterface,
    BBox,
    ProcTree
};

export type { nodePos, nodeAttr, offshoot, node }
