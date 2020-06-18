import RNG from 'random-seed';

const html = {
    node( tag, set ) {
        const node = document.createElement( tag );
        html.attr( node, set );
        return node;
    },
    nodeNS( tag, set, ns ) {
        const node = document.createElementNS( ns, tag );
        html.attr( node, set );
        return node;
    },
    attr( node, set ) {
        for (let name in set) node.setAttribute( name, set[ name ] );
    },

    svg: {
        root( set ) {
            const svg = html.svg.node( 'svg', set );
            svg.setAttribute( 'xmlns', "http://www.w3.org/2000/svg" );
            svg.setAttributeNS( "http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink" );
            return svg;
        },
        node( tag, set ) {
            const el = html.nodeNS( tag, {}, "http://www.w3.org/2000/svg" );
            html.attr( el, set );
            return el;
        },
        stroke({ color='#000', w=1, opacity=1, cap='square', join='miter', dash='', nss=false },set={}) {
            set['stroke'] = color;
            set['stroke-width'] = w;
            set['stroke-linecap'] = cap;
            set['stroke-linejoin'] = join;
            if (dash) set['stroke-dasharray'] = dash;
            if (opacity < 1) set['stroke-opacity'] = opacity;
            if (nss) set['vector-effect'] = 'non-scaling-stroke';

            return set;
        },

        compilePathDescription( points ) {
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
    toRadians( degrees ) {
        return degrees * (Math.PI / 180);
    },

    fromAngle( angle, length=1, tx=0, ty=0, svgCommand, precision ) {
        const a = [
            Math.sin( math.toRadians( angle ) ) * length + tx,
            - Math.cos( math.toRadians( angle ) ) * length + ty,
        ];

        if (precision) {
            a[ 0 ] = Math.round( a[ 0 ] * precision );
            a[ 1 ] = Math.round( a[ 1 ] * precision );
        }

        if (svgCommand) a.unshift( svgCommand );

        return a;
    },

    rectFromLine( p1, p2, a1, a2, w1, w2, precision ) {
        w1 /= 2;
        w2 /= 2;
        return [
            math.fromAngle( a1 - 90, w1, p1[0], p1[1], 'M', precision ),
            math.fromAngle( a2 - 90, w2, p2[0], p2[1], 'L', precision ),
            math.fromAngle( a2 + 90, w2, p2[0], p2[1], 'L', precision ),
            math.fromAngle( a1 + 90, w1, p1[0], p1[1], 'L', precision ),
            'Z',
        ];
    },

    pointOnLine( p1, p2, d ) {
        return [
            p1[0] + d * (p2[0] - p1[0]),
            p1[1] + d * (p2[1] - p1[1]),
        ];
    },

    distance( p1, p2 ) {
        return Math.sqrt( (p1[0]-p2[0])**2 + (p1[1]-p2[1])**2 );
    }
};

const plantHelper = {
    rootPosAngle( rng, xMax, maxAngle ) {
        const x = rng.range( -xMax, xMax );
        const f = Math.abs( x ) / xMax;
        return {
            x,
            segmentAngle: maxAngle * f * (x < 0 ? -1 : 1),
        };
    },

    segmentAngle( baseNode ) {
        if (baseNode.attr.segmentAngle !== undefined) return baseNode.attr.segmentAngle;
        return baseNode.attr.angle;
    },

    nextAngle( rng, pos, prevNode, variance, alternate ) {
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

    archingBranchAngle( rng, pos, prevNode, variance, numAdjust ) {
        if (pos.isOffshoot) return prevNode.attr.angle;

        const pa = plantHelper.segmentAngle( prevNode );
        const base = prevNode.branchRoot.attr.branchArchAngle;
        const f = numAdjust ? (1 - numAdjust) + numAdjust * (1 - pos.numFactor) : 1;

        return pa + f * base + rng.range( -variance, variance );
    },

    repeat( rng, n, p, cb, shuffle=true ) {
        const a = [];

        if (typeof p == 'function') {
            cb = p;
            p = 1;
        }

        if (p <= 0) return a;
        const test = p < 1;

        if (Array.isArray( n )) {
            for (let i of n) if (!test || rng.test( p )) {
                a.push( cb( i ) );
            }
        }
        else if (typeof n == 'object') {
            for (let i=n.from; i<=n.to; i+=n.step) if (!test || rng.test( p )) {
                a.push( cb( i ) );
            }
        }
        else {
            if (p > 1 && p > n) n = rng.intRange( n, p );

            for (let i=0; i<n; i++) if (!test || rng.test( p )) {
                a.push( cb( i ) );
            }
        }

        if (shuffle) rng.shuffle( a );

        return a;
    }
};

const rng = seed => {
    if (seed === undefined) seed = (Math.random() + '').substring( 2 ) * 1;
    let fn;

    const rng = {
        get seed() {
            return seed;
        },
        reset() {
            fn = (new RNG( seed )).random;
        },

        random( v=1 ) {
            return fn() * v;
        },
        test( p=.5, pass=true, fail=false ) {
            if (p >= 1) return pass;
            if (p <= 0) return fail;
            return fn() < p ? pass : fail;
        },
        range( v0, v1 ) {
            if (v0==v1) return v0;
            return v0 + fn() * ( v1 - v0 );
        },
        intRange( v0, v1 ) {
            if (v0==v1) return v0;
            return v0 + Math.floor( fn() * ( v1 - v0 + 1 ) );
        },
        ranges( ... ranges ) {
            const ep = 1 / ranges.length;

            ranges = [ ... ranges ];
            const last = ranges.pop();

            for (let r of ranges) {
                const p = r[2] || ep;
                if (rng.test( p )) return rng.range( r[0], r[1] );
            }

            return rng.range( last[0], last[1] );
        },

        shuffle( a ) {
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

class BBox {
    constructor({ x0, x1, y0, y1 }={}) {
        this.x0 = Infinity;
        this.x1 = -Infinity;
        this.y0 = Infinity;
        this.y1 = -Infinity;

        if (x0 !== undefined) this.x0 = x0;
        if (x1 !== undefined) this.x1 = x1;
        if (y0 !== undefined) this.y0 = y0;
        if (y1 !== undefined) this.y1 = y1;
    }

    addX( v ) {
        if (v < this.x0) this.x0 = v;
        if (v > this.x1) this.x1 = v;
        return this;
    }
    addY( v ) {
        if (v < this.y0) this.y0 = v;
        if (v > this.y1) this.y1 = v;
        return this;
    }
    addPoint( x, y ) {
        this.addX( x );
        this.addY( y );
        return this;
    }
    addBBox( bbox ) {
        this.addX( bbox.x0 );
        this.addX( bbox.x1 );
        this.addY( bbox.y0 );
        this.addY( bbox.y1 );
        return this;
    }

    expand( v ) {
        this.x0 -= v;
        this.x1 += v;

        this.y0 -= v;
        this.y1 += v;

        return this;
    }

    contains( bbox, strict ) {
        if (strict) return this.x0 < bbox.x0 && this.x1 > bbox.x1 && this.y0 < bbox.y0 && this.y1 > bbox.y1;
        return this.x0 <= bbox.x0 && this.x1 >= bbox.x1 && this.y0 <= bbox.y0 && this.y1 >= bbox.y1;
    }
    containedBy( bbox, strict ) {
        if (strict) return this.x0 > bbox.x0 && this.x1 < bbox.x1 && this.y0 > bbox.y0 && this.y1 < bbox.y1;
        return this.x0 >= bbox.x0 && this.x1 <= bbox.x1 && this.y0 >= bbox.y0 && this.y1 <= bbox.y1;
    }
    containsPoint( x, y, strict ) {
        if (strict) return !( x <= this.x0 || x >= this.x1 || y <= this.y0 || y >= this.y1 );
        return !( x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1 );
    }

    clone() {
        return new BBox( this.data );
    }

    withPrecision( p ) {
        return new BBox({
            x0: Math.round( this.x0 * p ),
            x1: Math.round( this.x1 * p ),
            y0: Math.round( this.y0 * p ),
            y1: Math.round( this.y1 * p ),
        });
    }

    get width() {
        return this.x1 - this.x0;
    }
    get height() {
        return this.y1 - this.y0;
    }

    get aspectRatio() {
        return this.width / this.height;
    }

    get data() {
        return {
            x0: this.x0,
            x1: this.x1,
            y0: this.y0,
            y1: this.y1
        };
    }

    get pointsArray() {
        return [
            [ this.x0, this.y0 ],
            [ this.x1, this.y1 ],
        ];
    }

    get viewBox() {
        return `${this.x0} ${this.y0} ${this.width} ${this.height}`;
    }
}

class ProcTree {

    constructor( maxBranchNum, getNode, getOffshoots ) {
        this.maxBranchNum = maxBranchNum;
        this.getNode = getNode;
        this.getOffshoots = getOffshoots;

        this.roots = [];
    }

    grow() {
        const roots = this.getOffshoots( null );
        for (let i in roots) this.growBranch( null, i, roots[ i ].n, roots[ i ].attr );
    }

    growBranch( rootNode, offshootNum, segmentCount, attr ) {
        const isTreeRoot = !rootNode;

        let node = this.addNode( rootNode, true, offshootNum, segmentCount, attr );

        if (isTreeRoot) this.roots.push( node );
        const isLastBranch = this.maxBranchNum == node.pos.branchNum;

        if (!isLastBranch && isTreeRoot) {
            const offshoots = this.getOffshoots( node );
            for (let i in offshoots) this.growBranch( node, i, offshoots[ i ].n, offshoots[ i ].attr );
        }

        for (let i=0; i<segmentCount; i++) {
            node = this.addNode( node, false, offshootNum, segmentCount );
            if (!isLastBranch) {
                const offshoots = this.getOffshoots( node );
                for (let i in offshoots) this.growBranch( node, i, offshoots[ i ].n, offshoots[ i ].attr );
            }
        }
    }

    addNode( prev, isOffshoot, offshootNum, maxNum, rootAttr ) {
        const pos = this.getPos( prev ? prev.pos : null, isOffshoot, maxNum );
        const node = {
            pos,
            attr: { ... (rootAttr||{}), ... (this.getNode( pos, prev, rootAttr )||{}) },
            offshoots: [],

            prev: null,
            next: null,

            branchRoot: null,
            treeRoot: null,
        };

        if (prev) {
            node.prev = prev;
            node.branchRoot = isOffshoot ? node : prev.isOffshoot ? prev : prev.branchRoot;
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

    getPos( prev, isOffshoot, maxNum ) {
        if (!prev) return {
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

        const pos = {
            num: isOffshoot ? 0 : prev.num + 1,
            branchNum: isOffshoot ? prev.branchNum + 1 : prev.branchNum,

            height: isOffshoot ? prev.height : prev.height + 1,
            offshootHeight: isOffshoot ? prev.num : prev.offshootHeight,

            isRoot: false,

            isLast: false,
            isLastBranch: false,

            isOffshoot,
        };

        if (pos.num == maxNum) pos.isLast = true;
        if (pos.branchNum == this.maxBranchNum) pos.isLastBranch = true;

        pos.numFactor = maxNum ? (1 - pos.num / maxNum) : 1;
        pos.branchFactor = this.maxBranchNum ? (1 - pos.branchNum / this.maxBranchNum) : 1;

        return pos;
    }

    eachSegment( cb ) {
        for (let node of this.roots) this._each( node, cb );
    }
    _each( node, cb ) {
        // note: the treeRoot node can have offshoots
        // other nodes that are branchRoots cannot have offshoots
        while ( node ) {
            if (node.pos.num > 0) cb( node.prev, node );
            for (let offshootNode of node.offshoots) this._each( offshootNode.next, cb );
            node = node.next;
        }
    }
}

export {
    html,
    math,
    plantHelper,
    rng,
    BBox,
    ProcTree,
};