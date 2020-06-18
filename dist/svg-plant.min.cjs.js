'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var RNG = _interopDefault(require('random-seed'));

var html = {
    node: function node( tag, set ) {
        var node = document.createElement( tag );
        html.attr( node, set );
        return node;
    },
    nodeNS: function nodeNS( tag, set, ns ) {
        var node = document.createElementNS( ns, tag );
        html.attr( node, set );
        return node;
    },
    attr: function attr( node, set ) {
        for (var name in set) { node.setAttribute( name, set[ name ] ); }
    },

    svg: {
        root: function root( set ) {
            var svg = html.svg.node( 'svg', set );
            svg.setAttribute( 'xmlns', "http://www.w3.org/2000/svg" );
            svg.setAttributeNS( "http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink" );
            return svg;
        },
        node: function node( tag, set ) {
            var el = html.nodeNS( tag, {}, "http://www.w3.org/2000/svg" );
            html.attr( el, set );
            return el;
        },
        stroke: function stroke(ref,set) {
            var color = ref.color; if ( color === void 0 ) color = '#000';
            var w = ref.w; if ( w === void 0 ) w = 1;
            var opacity = ref.opacity; if ( opacity === void 0 ) opacity = 1;
            var cap = ref.cap; if ( cap === void 0 ) cap = 'square';
            var join = ref.join; if ( join === void 0 ) join = 'miter';
            var dash = ref.dash; if ( dash === void 0 ) dash = '';
            var nss = ref.nss; if ( nss === void 0 ) nss = false;
            if ( set === void 0 ) set={};

            set['stroke'] = color;
            set['stroke-width'] = w;
            set['stroke-linecap'] = cap;
            set['stroke-linejoin'] = join;
            if (dash) { set['stroke-dasharray'] = dash; }
            if (opacity < 1) { set['stroke-opacity'] = opacity; }
            if (nss) { set['vector-effect'] = 'non-scaling-stroke'; }

            return set;
        },

        compilePathDescription: function compilePathDescription( points ) {
            var d = [];

            for (var i = 0, list = points; i < list.length; i += 1) {
                var p = list[i];

                if (p.length == 1) { d.push( p ); }
                else if (p.length == 2) { d.push( p[0], p[1] ); }
                else if (p.length == 3) { d.push( p[0], p[1], p[2] ); }
            }

            return d.join( ' ' );
        }
    },
};

var math = {
    toRadians: function toRadians( degrees ) {
        return degrees * (Math.PI / 180);
    },

    fromAngle: function fromAngle( angle, length, tx, ty, svgCommand, precision ) {
        if ( length === void 0 ) length=1;
        if ( tx === void 0 ) tx=0;
        if ( ty === void 0 ) ty=0;

        var a = [
            Math.sin( math.toRadians( angle ) ) * length + tx,
            - Math.cos( math.toRadians( angle ) ) * length + ty ];

        if (precision) {
            a[ 0 ] = Math.round( a[ 0 ] * precision );
            a[ 1 ] = Math.round( a[ 1 ] * precision );
        }

        if (svgCommand) { a.unshift( svgCommand ); }

        return a;
    },

    rectFromLine: function rectFromLine( p1, p2, a1, a2, w1, w2, precision ) {
        w1 /= 2;
        w2 /= 2;
        return [
            math.fromAngle( a1 - 90, w1, p1[0], p1[1], 'M', precision ),
            math.fromAngle( a2 - 90, w2, p2[0], p2[1], 'L', precision ),
            math.fromAngle( a2 + 90, w2, p2[0], p2[1], 'L', precision ),
            math.fromAngle( a1 + 90, w1, p1[0], p1[1], 'L', precision ),
            'Z' ];
    },

    pointOnLine: function pointOnLine( p1, p2, d ) {
        return [
            p1[0] + d * (p2[0] - p1[0]),
            p1[1] + d * (p2[1] - p1[1]) ];
    },

    distance: function distance( p1, p2 ) {
        return Math.sqrt( Math.pow( (p1[0]-p2[0]), 2 ) + Math.pow( (p1[1]-p2[1]), 2 ) );
    }
};

var plantHelper = {
    rootPosAngle: function rootPosAngle( rng, xMax, maxAngle ) {
        var x = rng.range( -xMax, xMax );
        var f = Math.abs( x ) / xMax;
        return {
            x: x,
            segmentAngle: maxAngle * f * (x < 0 ? -1 : 1),
        };
    },

    segmentAngle: function segmentAngle( baseNode ) {
        if (baseNode.attr.segmentAngle !== undefined) { return baseNode.attr.segmentAngle; }
        return baseNode.attr.angle;
    },

    nextAngle: function nextAngle( rng, pos, prevNode, variance, alternate ) {
        if (pos.isOffshoot) { return prevNode.attr.angle; }

        var pa = this.segmentAngle( prevNode );

        if (alternate) {
            var dir = pos.branchNum>0 ? 1 : prevNode.treeRoot.attr.x>=0 ? 1 : -1;
            return pa + (prevNode.pos.num % 2 ? 1 : -1) * rng.range( 0, variance ) * dir;
        }
        else {
            return pa + rng.range( -variance, variance );
        }
    },

    archingBranchAngle: function archingBranchAngle( rng, pos, prevNode, variance, numAdjust ) {
        if (pos.isOffshoot) { return prevNode.attr.angle; }

        var pa = plantHelper.segmentAngle( prevNode );
        var base = prevNode.branchRoot.attr.branchArchAngle;
        var f = numAdjust ? (1 - numAdjust) + numAdjust * (1 - pos.numFactor) : 1;

        return pa + f * base + rng.range( -variance, variance );
    },

    repeat: function repeat( rng, n, p, cb, shuffle ) {
        if ( shuffle === void 0 ) shuffle=true;

        var a = [];

        if (typeof p == 'function') {
            cb = p;
            p = 1;
        }

        if (p <= 0) { return a; }
        var test = p < 1;

        if (Array.isArray( n )) {
            for (var i$3 = 0, list = n; i$3 < list.length; i$3 += 1) {
                var i = list[i$3];

                if (!test || rng.test( p )) {
                a.push( cb( i ) );
            }
            }
        }
        else if (typeof n == 'object') {
            for (var i$1=n.from; i$1<=n.to; i$1+=n.step) { if (!test || rng.test( p )) {
                a.push( cb( i$1 ) );
            } }
        }
        else {
            if (p > 1 && p > n) { n = rng.intRange( n, p ); }

            for (var i$2=0; i$2<n; i$2++) { if (!test || rng.test( p )) {
                a.push( cb( i$2 ) );
            } }
        }

        if (shuffle) { rng.shuffle( a ); }

        return a;
    }
};

var rng = function (seed) {
    if (seed === undefined) { seed = (Math.random() + '').substring( 2 ) * 1; }
    var fn;

    var rng = {
        get seed() {
            return seed;
        },
        reset: function reset() {
            fn = (new RNG( seed )).random;
        },

        random: function random( v ) {
            if ( v === void 0 ) v=1;

            return fn() * v;
        },
        test: function test( p, pass, fail ) {
            if ( p === void 0 ) p=.5;
            if ( pass === void 0 ) pass=true;
            if ( fail === void 0 ) fail=false;

            if (p >= 1) { return pass; }
            if (p <= 0) { return fail; }
            return fn() < p ? pass : fail;
        },
        range: function range( v0, v1 ) {
            if (v0==v1) { return v0; }
            return v0 + fn() * ( v1 - v0 );
        },
        intRange: function intRange( v0, v1 ) {
            if (v0==v1) { return v0; }
            return v0 + Math.floor( fn() * ( v1 - v0 + 1 ) );
        },
        ranges: function ranges() {
            var ranges = [], len = arguments.length;
            while ( len-- ) ranges[ len ] = arguments[ len ];

            var ep = 1 / ranges.length;

            ranges = [].concat( ranges );
            var last = ranges.pop();

            for (var i = 0, list = ranges; i < list.length; i += 1) {
                var r = list[i];

                var p = r[2] || ep;
                if (rng.test( p )) { return rng.range( r[0], r[1] ); }
            }

            return rng.range( last[0], last[1] );
        },

        shuffle: function shuffle( a ) {
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor( fn() * (i + 1) );
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a;
        }
    };

    rng.reset();

    return rng;
};

var BBox = function BBox(ref) {
    if ( ref === void 0 ) ref={};
    var x0 = ref.x0;
    var x1 = ref.x1;
    var y0 = ref.y0;
    var y1 = ref.y1;

    this.x0 = Infinity;
    this.x1 = -Infinity;
    this.y0 = Infinity;
    this.y1 = -Infinity;

    if (x0 !== undefined) { this.x0 = x0; }
    if (x1 !== undefined) { this.x1 = x1; }
    if (y0 !== undefined) { this.y0 = y0; }
    if (y1 !== undefined) { this.y1 = y1; }
};

var prototypeAccessors = { width: { configurable: true },height: { configurable: true },aspectRatio: { configurable: true },data: { configurable: true },pointsArray: { configurable: true },viewBox: { configurable: true } };

BBox.prototype.addX = function addX ( v ) {
    if (v < this.x0) { this.x0 = v; }
    if (v > this.x1) { this.x1 = v; }
    return this;
};
BBox.prototype.addY = function addY ( v ) {
    if (v < this.y0) { this.y0 = v; }
    if (v > this.y1) { this.y1 = v; }
    return this;
};
BBox.prototype.addPoint = function addPoint ( x, y ) {
    this.addX( x );
    this.addY( y );
    return this;
};
BBox.prototype.addBBox = function addBBox ( bbox ) {
    this.addX( bbox.x0 );
    this.addX( bbox.x1 );
    this.addY( bbox.y0 );
    this.addY( bbox.y1 );
    return this;
};

BBox.prototype.expand = function expand ( v ) {
    this.x0 -= v;
    this.x1 += v;

    this.y0 -= v;
    this.y1 += v;

    return this;
};

BBox.prototype.contains = function contains ( bbox, strict ) {
    if (strict) { return this.x0 < bbox.x0 && this.x1 > bbox.x1 && this.y0 < bbox.y0 && this.y1 > bbox.y1; }
    return this.x0 <= bbox.x0 && this.x1 >= bbox.x1 && this.y0 <= bbox.y0 && this.y1 >= bbox.y1;
};
BBox.prototype.containedBy = function containedBy ( bbox, strict ) {
    if (strict) { return this.x0 > bbox.x0 && this.x1 < bbox.x1 && this.y0 > bbox.y0 && this.y1 < bbox.y1; }
    return this.x0 >= bbox.x0 && this.x1 <= bbox.x1 && this.y0 >= bbox.y0 && this.y1 <= bbox.y1;
};
BBox.prototype.containsPoint = function containsPoint ( x, y, strict ) {
    if (strict) { return !( x <= this.x0 || x >= this.x1 || y <= this.y0 || y >= this.y1 ); }
    return !( x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1 );
};

BBox.prototype.clone = function clone () {
    return new BBox( this.data );
};

BBox.prototype.withPrecision = function withPrecision ( p ) {
    return new BBox({
        x0: Math.round( this.x0 * p ),
        x1: Math.round( this.x1 * p ),
        y0: Math.round( this.y0 * p ),
        y1: Math.round( this.y1 * p ),
    });
};

prototypeAccessors.width.get = function () {
    return this.x1 - this.x0;
};
prototypeAccessors.height.get = function () {
    return this.y1 - this.y0;
};

prototypeAccessors.aspectRatio.get = function () {
    return this.width / this.height;
};

prototypeAccessors.data.get = function () {
    return {
        x0: this.x0,
        x1: this.x1,
        y0: this.y0,
        y1: this.y1
    };
};

prototypeAccessors.pointsArray.get = function () {
    return [
        [ this.x0, this.y0 ],
        [ this.x1, this.y1 ] ];
};

prototypeAccessors.viewBox.get = function () {
    return ((this.x0) + " " + (this.y0) + " " + (this.width) + " " + (this.height));
};

Object.defineProperties( BBox.prototype, prototypeAccessors );

var ProcTree = function ProcTree( maxBranchNum, getNode, getOffshoots ) {
    this.maxBranchNum = maxBranchNum;
    this.getNode = getNode;
    this.getOffshoots = getOffshoots;

    this.roots = [];
};

ProcTree.prototype.grow = function grow () {
    var roots = this.getOffshoots( null );
    for (var i in roots) { this.growBranch( null, i, roots[ i ].n, roots[ i ].attr ); }
};

ProcTree.prototype.growBranch = function growBranch ( rootNode, offshootNum, segmentCount, attr ) {
    var isTreeRoot = !rootNode;

    var node = this.addNode( rootNode, true, offshootNum, segmentCount, attr );

    if (isTreeRoot) { this.roots.push( node ); }
    var isLastBranch = this.maxBranchNum == node.pos.branchNum;

    if (!isLastBranch && isTreeRoot) {
        var offshoots = this.getOffshoots( node );
        for (var i in offshoots) { this.growBranch( node, i, offshoots[ i ].n, offshoots[ i ].attr ); }
    }

    for (var i$1=0; i$1<segmentCount; i$1++) {
        node = this.addNode( node, false, offshootNum, segmentCount );
        if (!isLastBranch) {
            var offshoots$1 = this.getOffshoots( node );
            for (var i$2 in offshoots$1) { this.growBranch( node, i$2, offshoots$1[ i$2 ].n, offshoots$1[ i$2 ].attr ); }
        }
    }
};

ProcTree.prototype.addNode = function addNode ( prev, isOffshoot, offshootNum, maxNum, rootAttr ) {
    var pos = this.getPos( prev ? prev.pos : null, isOffshoot, maxNum );
    var node = {
        pos: pos,
        attr: Object.assign({}, (rootAttr||{}), (this.getNode( pos, prev, rootAttr )||{})),
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
};

ProcTree.prototype.getPos = function getPos ( prev, isOffshoot, maxNum ) {
    if (!prev) { return {
        num: 0,
        branchNum: 0,

        height: 0,
        offshootHeight: 0,

        isRoot: true,

        isLast: maxNum == 0,
        isLastBranch: this.maxBranchNum == 0,

        isOffshoot: isOffshoot,

        numFactor: 1,
        branchFactor: 1,
    }; }

    var pos = {
        num: isOffshoot ? 0 : prev.num + 1,
        branchNum: isOffshoot ? prev.branchNum + 1 : prev.branchNum,

        height: isOffshoot ? prev.height : prev.height + 1,
        offshootHeight: isOffshoot ? prev.num : prev.offshootHeight,

        isRoot: false,

        isLast: false,
        isLastBranch: false,

        isOffshoot: isOffshoot,
    };

    if (pos.num == maxNum) { pos.isLast = true; }
    if (pos.branchNum == this.maxBranchNum) { pos.isLastBranch = true; }

    pos.numFactor = maxNum ? (1 - pos.num / maxNum) : 1;
    pos.branchFactor = this.maxBranchNum ? (1 - pos.branchNum / this.maxBranchNum) : 1;

    return pos;
};

ProcTree.prototype.eachSegment = function eachSegment ( cb ) {
    for (var i = 0, list = this.roots; i < list.length; i += 1) {
            var node = list[i];

            this._each( node, cb );
        }
};
ProcTree.prototype._each = function _each ( node, cb ) {
    // note: the treeRoot node can have offshoots
    // other nodes that are branchRoots cannot have offshoots
    while ( node ) {
        if (node.pos.num > 0) { cb( node.prev, node ); }
        for (var i = 0, list = node.offshoots; i < list.length; i += 1) {
                var offshootNode = list[i];

                this._each( offshootNode.next, cb );
            }
        node = node.next;
    }
};

var plantPotSvg = function (pathAttr) {
    var baseCfg = {
        rimHeight: 20,
        rimLipOuter: 2,
        rimLipInner: 4,
        bottom: 15,
    };

    var sw = pathAttr ? ('stroke-width' in pathAttr ? pathAttr[ 'stroke-width' ] : 2) : false;
    if (sw) { pathAttr[ 'stroke-width' ] = sw; }

    var pad = sw ? sw / 2 : 0;

    var getPoints = function (cfg) {
        return [
            [ 'M', pad, pad ],
            [ 'L', 100-pad, pad ],
            [ 'L', 100-pad - cfg.rimLipOuter, cfg.rimHeight ],
            [ 'L', 100-pad - cfg.rimLipInner, cfg.rimHeight ],
            [ 'L', 100-pad - cfg.bottom, 100-pad ],
            [ 'L', pad+cfg.bottom, 100-pad ],
            [ 'L', pad+cfg.rimLipInner, cfg.rimHeight ],
            [ 'L', pad+cfg.rimLipOuter, cfg.rimHeight ],
            'Z' ];
    };

    if (!pathAttr) { pathAttr = {}; }
    pathAttr.d = html.svg.compilePathDescription( getPoints( baseCfg ) );
    var path = html.svg.node( 'path', pathAttr );

    var svg = html.svg.root({
        class: 'svg-plant-pot',
        viewBox: '0 0 100 100',
        preserveAspectRatio: 'xMidYMax meet',
    });

    svg.appendChild( path );

    return svg;
};

// ripped from https://github.com/kfitfk/svg-boundings

var MIN_X = 'minX';
var MAX_X = 'maxX';
var MIN_Y = 'minY';
var MAX_Y = 'maxY';

/**
 * expand the x-bounds, if the value lies outside the bounding box
 */
function expandXBounds(bounds, value) {
  if (bounds[MIN_X] > value) { bounds[MIN_X] = value; }
  else if (bounds[MAX_X] < value) { bounds[MAX_X] = value; }
}

/**
 * expand the y-bounds, if the value lies outside the bounding box
 */
function expandYBounds(bounds, value) {
  if (bounds[MIN_Y] > value) { bounds[MIN_Y] = value; }
  else if (bounds[MAX_Y] < value) { bounds[MAX_Y] = value; }
}

/**
 * Calculate the bezier value for one dimension at distance 't'
 */
function calculateBezier(t, p0, p1, p2, p3) {
  var mt = 1-t;
  return (mt*mt*mt*p0) + (3*mt*mt*t*p1) + (3*mt*t*t*p2) + (t*t*t*p3);
}

/**
 * Calculate the bounding box for this bezier curve.
 * http://pomax.nihongoresources.com/pages/bezier/
 */
function bezierCurveBoundingBox(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
  var bounds = {};
  bounds[MIN_X] = Math.min(x1, x2);
  bounds[MIN_Y] = Math.min(y1, y2);
  bounds[MAX_X] = Math.max(x1, x2);
  bounds[MAX_Y] = Math.max(y1, y2);

  var dcx0 = cx1 - x1;
  var dcy0 = cy1 - y1;
  var dcx1 = cx2 - cx1;
  var dcy1 = cy2 - cy1;
  var dcx2 = x2 - cx2;
  var dcy2 = y2 - cy2;

  if (cx1<bounds[MIN_X] || cx1>bounds[MAX_X] || cx2<bounds[MIN_X] || cx2>bounds[MAX_X]) {
    // Just for better reading because we are doing middle school math here
    var a = dcx0;
    var b = dcx1;
    var c = dcx2;

    if (a+c !== 2*b) { b += 0.0001; }

    var numerator = 2*(a - b);
    var denominator = 2*(a - 2*b + c);
    if (denominator === 0) { denominator = 0.0001; }
    var quadroot = (2*b-2*a)*(2*b-2*a) - 2*a*denominator;
    var root = Math.sqrt(quadroot);

    var t1 =  (numerator + root) / denominator;
    var t2 =  (numerator - root) / denominator;

    if (0<t1 && t1<1) {
      expandXBounds(bounds, calculateBezier(t1, x1, cx1, cx2, x2));
    }
    if (0<t2 && t2<1) {
      expandXBounds(bounds, calculateBezier(t2, x1, cx1, cx2, x2));
    }
  }

  if (cy1<bounds[MIN_Y] || cy1>bounds[MAX_Y] || cy2<bounds[MIN_Y] || cy2>bounds[MAX_Y]) {
    a = dcy0;
    b = dcy1;
    c = dcy2;

    if (a+c !== 2*b) { b += 0.0001; }

    numerator = 2*(a - b);
    denominator = 2*(a - 2*b + c);
    if (denominator === 0) { denominator = 0.0001; }
    quadroot = (2*b-2*a)*(2*b-2*a) - 2*a*denominator;
    root = Math.sqrt(quadroot);

    t1 =  (numerator + root) / denominator;
    t2 =  (numerator - root) / denominator;

    if (0<t1 && t1<1) {
      expandYBounds(bounds, calculateBezier(t1, y1, cy1, cy2, y2));
    }
    if (0<t2 && t2<1) {
      expandYBounds(bounds, calculateBezier(t2, y1, cy1, cy2, y2));
    }
  }

  return {
    x0: bounds[MIN_X],
    x1: bounds[MAX_X],
    y0: bounds[MIN_Y],
    y1: bounds[MAX_Y],
  };
}

var precision = 10000;
var prc = function (v) {
    if (v.length) { return [
        Math.round( v[0] * precision ),
        Math.round( v[1] * precision ) ]; }

    return Math.round( v * precision );
};

var BranchSegment = function BranchSegment( base, style, n0, n1 ) {
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
};

BranchSegment.prototype.getPoints = function getPoints ( age ) {
    var ageFactor = this.getAgeFactor( age );
    if (!ageFactor) { return; }

    var top = this.top;
    if (ageFactor < 1) {
        top = math.fromAngle( this.angle, this.length * ageFactor, this.base[0], this.base[1] );
    }

    return math.rectFromLine(
        this.base, top,
        this.bottomAngle, this.topAngle,
        this.bottomWidth, this.topWidth,
        precision
    );
};

BranchSegment.prototype.getBoundingBox = function getBoundingBox () {
    var points = math.rectFromLine(
        this.base, this.top,
        this.bottomAngle, this.topAngle,
        this.bottomWidth, this.topWidth,
        false
    );

    var bb = new BBox();
    bb.addPoint( points[0][1], points[0][2] );
    bb.addPoint( points[1][1], points[1][2] );
    bb.addPoint( points[2][1], points[2][2] );
    bb.addPoint( points[3][1], points[3][2] );

    return bb;
};

BranchSegment.prototype.getAgeFactor = function getAgeFactor ( age ) {
    if (age <= this.ageOffset) { return 0; }
    if (age >= this.ageOffset + this.length) { return 1; }
    return (age - this.ageOffset) / this.length;
};

BranchSegment.prototype.getOffsetPoint = function getOffsetPoint ( x, y ) {
    if (!x) {
        if (!y) { return this.base; }
        if (y==1) { return this.top; }
        return math.fromAngle( this.angle, this.length * y, this.base[0], this.base[1] );
    }

    var dir = this.angle < 0 ? 1 : -1;

    if (!y) {
        return math.fromAngle( this.bottomAngle + 90*dir, this.bottomWidth/2 * x, this.base[0], this.base[1] );
    }

    if (y==1) {
        return math.fromAngle( this.topAngle + 90*dir, this.topWidth/2 * x, this.top[0], this.top[1] );
    }

    var l1 = [
        math.fromAngle( this.bottomAngle + 90*dir, this.bottomWidth/2, this.base[0], this.base[1] ),
        math.fromAngle( this.topAngle + 90*dir, this.topWidth/2, this.top[0], this.top[1] )
    ];
    var l2 = [
        math.fromAngle( this.bottomAngle + 90*dir, -this.bottomWidth/2, this.base[0], this.base[1] ),
        math.fromAngle( this.topAngle + 90*dir, -this.topWidth/2, this.top[0], this.top[1] )
    ];
    var l3 = [
        math.pointOnLine( l1[0], l1[1], y ),
        math.pointOnLine( l2[0], l2[1], y ) ];

    x = 1 - (x/2 + .5);

    return math.pointOnLine( l3[0], l3[1], x );
};

var Leaf = function Leaf( segment, ref ) {
    var angle = ref.angle;
    var length = ref.length;
    var handles = ref.handles;
    var style = ref.style;
    var xOffset = ref.xOffset;
    var yOffset = ref.yOffset;

    var base = segment.getOffsetPoint( xOffset, yOffset );
    this.base = base;
    this.pBase = prc( base );

    this.angle = angle;
    this.length = length;
    this.handles = handles;

    this.top = math.fromAngle( angle, length, base[0], base[1] );

    this.ageOffset = segment.ageOffset + segment.length * yOffset;

    this.style = style;

    this.bbox = this.getBoundingBox();
};

Leaf.prototype.getPoints = function getPoints ( age ) {
    var ageFactor = this.getAgeFactor( age );
    if (!ageFactor) { return; }

    var top = this.top;
    if (ageFactor < 1) {
        top = math.fromAngle( this.angle, this.length * ageFactor, this.base[0], this.base[1] );
    }

    var curves = this.getCurves( top, ageFactor, precision );

    top = prc( top );

    return [
        'M', this.pBase,
        'C', curves.up[0], curves.up[1], top,
        'C', curves.down[0], curves.down[1], this.pBase
    ];
};

Leaf.prototype.getBoundingBox = function getBoundingBox () {
    var c = this.getCurves( this.top, 1, false );
    var bb = new BBox(bezierCurveBoundingBox(
        this.base[0], this.base[1],
        c.up[0][0], c.up[0][1],
        c.up[1][0], c.up[1][1],
        this.top[0], this.top[1]
    ));

    bb.addBBox(bezierCurveBoundingBox(
        this.top[0], this.top[1],
        c.down[0][0], c.down[0][1],
        c.down[1][0], c.down[1][1],
        this.base[0], this.base[1]
    ));

    if (this.style['stroke-width']) { bb.expand( this.style['stroke-width'] / 2 ); }

    return bb;
};

Leaf.prototype.getCurves = function getCurves ( top, ageFactor, precision ) {
    var bha = this.handles.bottomAngle;
    var bhl = this.handles.bottomLength * ageFactor;
    var tha = this.handles.topAngle;
    var thl = this.handles.topLength * ageFactor;

    return {
        up: [
            math.fromAngle( this.angle + bha, this.length * bhl, this.base[0], this.base[1], '', precision ),
            math.fromAngle( this.angle + tha, this.length * thl, top[0], top[1], '', precision ) ],
        down: [
            math.fromAngle( this.angle - tha, this.length * thl, top[0], top[1], '', precision ),
            math.fromAngle( this.angle - bha, this.length * bhl, this.base[0], this.base[1], '', precision ) ],
    };
};

Leaf.prototype.getAgeFactor = function getAgeFactor ( age ) {
    if (age <= this.ageOffset) { return 0; }
    if (age >= this.ageOffset + this.length) { return 1; }
    return (age - this.ageOffset) / this.length;
};

var Branches = function Branches() {
    this.segments = [];
    this.leaves = [];
};

Branches.prototype.addSegment = function addSegment ( branchNum, segment ) {
    var branch = this.segments[ branchNum ];
    if (!branch) {
        branch = [];
        this.segments[ branchNum ] = branch;
    }
    branch.push( segment );
};
Branches.prototype.addLeaf = function addLeaf ( branchNum, leaf ) {
    var branch = this.leaves[ branchNum ];
    if (!branch) {
        branch = [];
        this.leaves[ branchNum ] = branch;
    }
    branch.push( leaf );
};

Branches.prototype.getArray = function getArray () {
    var ret = [];
    for (var i=0; i<this.segments.length; i++) {
        ret = ret.concat( this.segments[ i ] || [] );
        ret = ret.concat( this.sortLeaves( this.leaves[ i ] ) );
    }

    return ret;
};

Branches.prototype.sortLeaves = function sortLeaves ( a ) {
    if (!a) { return []; }

    return a.sort(function (l0,l1) {
        if (l1.bbox.containsPoint( l0.base[0], l0.base[1], true )) {
            return -1;
        }

        if (l0.bbox.containsPoint( l1.base[0], l1.base[1], true )) {
            return 1;
        }

        var d0 = math.distance( l0.base, [0,0] );
        var d1 = math.distance( l1.base, [0,0] );
        return d1 - d0;
    });
};

var PlantBody = function PlantBody( genus ) {
    this.genus = genus;
};

PlantBody.prototype.init = function init () {
        var this$1 = this;

    this.genus.reset();

    var tree = this.getTree();
    tree.grow();

    this.bbox = new BBox({
        x0: -this.genus.width/2,
        x1: this.genus.width/2,
        y0: -this.genus.height,
        y1: 0,
    });

    var branches = new Branches;
    var points = new Map();
    var maxAge = 0;

    var getBasePoint = function (node) {
        if (!node.prev) {
            var p = [ node.attr.x || 0, 0 ];
            this$1.bbox.addPoint( p[0], p[1] );
            return p;
        }
        else if (node.pos.isOffshoot) {
            var p$1 = points.get( node.prev );
            if (p$1) { return p$1; }

            var rp = [ node.prev.attr.x || 0, 0 ];
            points.set( node.prev, rp );
            this$1.bbox.addPoint( rp[0], rp[1] );
            return rp;
        }

        return points.get( node );
    };

    tree.eachSegment( function (n0,n1) {

        var base = getBasePoint( n0 );
        var style = this$1.genus.getSegmentStyle( n0, n1 );
        var s = new BranchSegment( base, style, n0, n1 );

        points.set( n1, s.top );
        this$1.bbox.addBBox( s.bbox );
        branches.addSegment( n0.pos.branchNum, s );

        this$1.genus.getLeaves( n0, n1 ).map( function (cfg, i) {
            var leaf = new Leaf( s, cfg );

            this$1.bbox.addBBox( leaf.bbox );
            branches.addLeaf( n0.pos.branchNum, leaf );

            if (leaf.ageOffset + leaf.length > maxAge) { maxAge = leaf.ageOffset + leaf.length; }
        });

        if (n1.attr.totalLength > maxAge) { maxAge = n1.attr.totalLength; }

    });

    this.parts = branches.getArray();
    this.maxAge = maxAge;

    // make sure the plant is centered
    var bboxX = Math.max( Math.abs( this.bbox.x0 ), Math.abs( this.bbox.x1 ) );
    this.bbox.x0 = -bboxX;
    this.bbox.x1 = bboxX;

    this.yFactor = (this.bbox.height / -this.bbox.y0) || 1;
};

PlantBody.prototype.getTree = function getTree () {
        var this$1 = this;

    var getNodeAttr = function ( pos, prev, attr ) {
        return {
            width: this$1.genus.getNodeWidth( pos, prev, attr ),
            angle: prev ? this$1.genus.getSegmentAngle( pos, prev, attr ) : 0,
            length: pos.isLast ? (prev ? prev.attr.length : 0) : this$1.genus.getSegmentLength( pos, prev, attr ),
            totalLength: prev ? ((pos.isOffshoot ? 0 : prev.attr.length) + prev.attr.totalLength) : 0,
        };
    };
    var getOffshoots = function (node) {
        if (!node) { return this$1.genus.getRoots(); }
        return this$1.genus.getOffshoots( node );
    };

    return new ProcTree( this.genus.maxBranchNum, getNodeAttr, getOffshoots );
};

PlantBody.prototype.render = function render ( age, colors, svg ) {
        if ( colors === void 0 ) colors=true;

    age *= this.maxAge;

    for (var i = 0, list = this.parts; i < list.length; i += 1) {
        var p = list[i];

            var points = p.getPoints( age );
        if (!points) { continue; }

        var style = {}, add = {};

        if (colors) {
            style = p.style;
            add = {};
            if (style['stroke-width']) { add['stroke-width'] = prc( style['stroke-width'] ); }
        }

        var set = Object.assign( {}, style, add, {
            d: html.svg.compilePathDescription( points ),
        });
        svg.appendChild( html.svg.node( 'path', set ) );
    }
};

PlantBody.prototype.getSvg = function getSvg ( age, colors ) {
    if (!this.segments) { this.init(); }

    var svg = html.svg.root({
        class: 'svg-plant-body',
        viewBox: this.bbox.withPrecision( precision ).viewBox,
        preserveAspectRatio: 'xMidYMax meet',
    });

    this.render( age, colors, svg );

    return svg;
};

var SvgPlant = function SvgPlant( genus, cfg ) {
    this._cfg = {
        color: true,
        age: 1,
        potSize: .3,
        potPathAttr: { fill: '#fc7', stroke: '#da5' },
    };
    if (typeof cfg == 'object') {
        for (var key in this._cfg) {
            if (key in cfg) { this[ key ] = cfg[ key ]; }
        }
    }

    this.body = new PlantBody( genus );
};

var prototypeAccessors$1 = { seed: { configurable: true },color: { configurable: true },age: { configurable: true },potSize: { configurable: true },potPathAttr: { configurable: true },svgElement: { configurable: true },potSvgElement: { configurable: true },bodySvgElement: { configurable: true } };

prototypeAccessors$1.seed.get = function () {
    return this.body.genus.rngSeed;
};

prototypeAccessors$1.color.get = function () { return this._cfg.color; };
prototypeAccessors$1.color.set = function ( v ) {
    v = !!v;
    if (v != this._cfg.color) {
        this._cfg.color = v;
        this.update();
    }
};

prototypeAccessors$1.age.get = function () { return this._cfg.age; };
prototypeAccessors$1.age.set = function ( v ) {
    v = Math.max( 0, Math.min( v, 1 ));
    if (v != this._cfg.age) {
        this._cfg.age = v;
        this.update( true, false );
    }
};

prototypeAccessors$1.potSize.get = function () { return this._cfg.potSize; };
prototypeAccessors$1.potSize.set = function ( v ) {
    v = Math.max( 0, Math.min( v, 1 ));
    if (v != this._cfg.potSize) {
        this._cfg.potSize = v;
        this.update( false, true );
    }
};

prototypeAccessors$1.potPathAttr.get = function () { return this._cfg.potPathAttr; };
prototypeAccessors$1.potPathAttr.set = function ( v ) {
    if (v != this._cfg.potPathAttr) {
        this._cfg.potPathAttr = v;
        this.update( false, true );
    }
};

SvgPlant.prototype.update = function update ( body, pot ) {
        if ( body === void 0 ) body=true;
        if ( pot === void 0 ) pot=true;

    if (body) { this._bodySvgElement = null; }
    if (pot) { this._potSvgElement = null; }
    this.updateSvgElement();
};

prototypeAccessors$1.svgElement.get = function () {
    if (!this._svgElement) {
        this._svgElement = this.getSvgElement();
    }
    return this._svgElement;
};
SvgPlant.prototype.updateSvgElement = function updateSvgElement () {
    var svg = this._svgElement;
    if (!svg) { return; }

    svg.innerHTML = this.getSvgElement().innerHTML;
};
SvgPlant.prototype.getSvgElement = function getSvgElement () {
    var svg = html.svg.root({
        class: 'svg-plant',
        viewBox: '0 0 1 1',
        preserveAspectRatio: 'xMidYMax meet',
    });

    var place = function ( el, x, y, w, h ) {
        el.setAttribute( 'x', x );
        el.setAttribute( 'y', y );
        el.setAttribute( 'width', w );
        el.setAttribute( 'height', h );
    };

    var pot = this.potSvgElement;
    var body = this.bodySvgElement;

    if (this._cfg.potSize >= 1) {
        svg.appendChild( pot );
        place( pot, 0, 0, 1, 1 );
    }
    else if (this._cfg.potSize <= 0) {
        svg.appendChild( body );
        place( body, 0, 0, 1, 1 );
    }
    else {
        svg.appendChild( pot );
        place( pot, 0, 1 - this._cfg.potSize, 1, this._cfg.potSize );
        svg.appendChild( body );

        // with high contrast there is a slight gap visible, between pot and plant.
        // without color this is way more noticable, and the slight overlap is invisible.
        var overlap = this._cfg.color ? 0 : .001;

        var height;
        var bodyHeight = 1 - this._cfg.potSize;

        if (this.body.yFactor > 1) {
            // this means the plant has points "below the fold"
            // or: points that overlap the potsize area
            // so the height of "1 - this._cfg.potSize" needs to be expanded accordingly

            var wrapperAR = 1 / bodyHeight;
            var aboveFoldBodyAR = this.body.bbox.width / -this.body.bbox.y0;
            if (wrapperAR < aboveFoldBodyAR) {
                // the plantbody is scaled down, to fit the viewbox's width
                // the yFactor now needs to be applied only to the plants scaled down height
                // not the full available area of "1 - this._cfg.potSize"

                var scaledBodyHeight = -this.body.bbox.y0 / this.body.bbox.width;
                height = bodyHeight + (scaledBodyHeight * this.body.yFactor - scaledBodyHeight);
            }
            else {
                height = bodyHeight * this.body.yFactor;
            }
        }
        else {
            height = bodyHeight;
        }

        place( body, 0, 0, 1, height + overlap );

    }

    return svg;
};

prototypeAccessors$1.potSvgElement.get = function () {
    if (this._cfg.potSize == 0) { return null; }

    if (!this._potSvgElement) {
        this._potSvgElement = this.getPotSvgElement();
    }
    return this._potSvgElement;
};
SvgPlant.prototype.getPotSvgElement = function getPotSvgElement () {
    if (!this._cfg.color) { return plantPotSvg(); }
    return plantPotSvg( this._cfg.potPathAttr );
};

prototypeAccessors$1.bodySvgElement.get = function () {
    if (this._cfg.potSize == 1) { return null; }

    if (!this._bodySvgElement) {
        this._bodySvgElement = this.getBodySvgElement();
    }
    return this._bodySvgElement;
};
SvgPlant.prototype.getBodySvgElement = function getBodySvgElement () {
    return this.body.getSvg( this._cfg.age, this._cfg.color );
};

SvgPlant.prototype.animate = function animate ( fromAge, toAge, durationMs ) {
        if ( fromAge === void 0 ) fromAge=0;
        if ( toAge === void 0 ) toAge=1;
        if ( durationMs === void 0 ) durationMs=3000;

    this.cancelAnimation();

    this._animation = {
        fromAge: fromAge,
        toAge: toAge,
        ageSpan: toAge - fromAge,
        currentAge: fromAge,

        durationMs: durationMs,

        nextAnimationFrame: undefined,

        paused: true,
    };

    this.resumeAnimation();
};
SvgPlant.prototype.pauseAnimation = function pauseAnimation () {
    if (this._animation) {
        cancelAnimationFrame( this._animation.nextAnimationFrame );
        this._animation.paused = true;
    }
};
SvgPlant.prototype.cancelAnimation = function cancelAnimation () {
    this.pauseAnimation();
    this._animation = null;
};
SvgPlant.prototype.resumeAnimation = function resumeAnimation () {
        var this$1 = this;

    var a = this._animation;
    if (!a || !a.paused) { return; }
    a.paused = false;

    this.age = a.currentAge;

    var acl = function (t) { return t<0 ? 0 : t>1 ? 1 : Math.sin( (t - .5) * Math.PI ) * .5 + .5; };
    var aclInv = function (t) { return t<0 ? 0 : t>1 ? 1 : Math.asin( t * 2 - 1 ) / Math.PI + .5; };

    var t0;
    var upd = function (ts) {
        if (!t0) {
            var f = (a.currentAge - a.fromAge) / a.ageSpan;
            t0 = ts - aclInv( f ) * a.durationMs;
            a.nextAnimationFrame = requestAnimationFrame( upd );
        }
        else {
            var f$1 = acl( Math.min( 1, (ts - t0) / a.durationMs ) );

            if (f$1 < 1) {
                this$1._cfg.age = a.fromAge + f$1 * a.ageSpan;
                a.currentAge = this$1._cfg.age;

                this$1._bodySvgElement = null;
                this$1.updateSvgElement();

                a.nextAnimationFrame = requestAnimationFrame( upd );
            }
            else {
                this$1.age = a.toAge;
                this$1._animation = null;
            }
        }
    };

    a.nextAnimationFrame = requestAnimationFrame( upd );
};

Object.defineProperties( SvgPlant.prototype, prototypeAccessors$1 );

var BaseGenus = function BaseGenus( rngSeed ) {
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
};

var prototypeAccessors$2 = { genusName: { configurable: true },rngSeed: { configurable: true } };
var staticAccessors = { genusName: { configurable: true } };

staticAccessors.genusName.get = function () {
    var cn = this.name;
    return cn.substring( 0, cn.length - 5 );
};
prototypeAccessors$2.genusName.get = function () {
    var cn = this.constructor.name;
    return cn.substring( 0, cn.length - 5 );
};
prototypeAccessors$2.rngSeed.get = function () {
    return this.rng.seed;
};
BaseGenus.prototype.reset = function reset () {
    this.rng.reset();
};

BaseGenus.prototype.getRoots = function getRoots () {
    return [
        {
            n: 3,
            attr: { x: 0, segmentAngle: 0 }
        } ];
};
BaseGenus.prototype.getOffshoots = function getOffshoots ( node ) {
    if (node.pos.isLast || node.pos.num==0) { return []; }

    return [
        {
            n: 1,
            attr: { segmentAngle: node.attr.angle - 60 }
        },
        {
            n: 1,
            attr: { segmentAngle: node.attr.angle + 60 }
        } ];
};

BaseGenus.prototype.getNodeWidth = function getNodeWidth ( _pos, _prev, _attr ) {
    return .1;
};
BaseGenus.prototype.getSegmentLength = function getSegmentLength ( _pos, _prev, _attr ) {
    return 1;
};
BaseGenus.prototype.getSegmentAngle = function getSegmentAngle ( pos, prev, _attr ) {
    if (pos.isOffshoot) { return prev.attr.angle; }
    return prev.attr.segmentAngle !== undefined ? prev.attr.segmentAngle : prev.attr.angle;
};

BaseGenus.prototype.getSegmentStyle = function getSegmentStyle ( _node0, _node1 ) {
    return this.segmentStyle;
};

BaseGenus.prototype.getLeaves = function getLeaves ( _n0, n1 ) {
    if (!n1.pos.isLast) { return []; }

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
};

Object.defineProperties( BaseGenus.prototype, prototypeAccessors$2 );
Object.defineProperties( BaseGenus, staticAccessors );

var BushyPlantGenus = /*@__PURE__*/(function (BaseGenus) {
    function BushyPlantGenus( rngSeed ) {
        BaseGenus.call( this, rngSeed );

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

    if ( BaseGenus ) BushyPlantGenus.__proto__ = BaseGenus;
    BushyPlantGenus.prototype = Object.create( BaseGenus && BaseGenus.prototype );
    BushyPlantGenus.prototype.constructor = BushyPlantGenus;

    BushyPlantGenus.prototype.getRoots = function getRoots () {
        return [
            {
                n: this.rng.intRange( 4, 6 ),
                attr: plantHelper.rootPosAngle( this.rng, .5, 6 ),
            } ];
    };
    BushyPlantGenus.prototype.getOffshoots = function getOffshoots ( node ) {
        var this$1 = this;

        if (node.pos.isLast || node.pos.num==0) { return []; }

        var p = .5 * (.5 + .5 * node.pos.numFactor) * (.5 + .5 * node.pos.branchFactor);
        var a = [];

        var getNodeCount = function () { return 4 - node.pos.branchNum - this$1.rng.test( .6, 1, 0 ); };

        if (this.rng.test( p )) { a.push({
            n: getNodeCount(),
            attr: {
                segmentAngle: node.attr.angle + this.rng.range( 25, 60 ),
            }
        }); }

        if (this.rng.test( p )) { a.push({
            n: getNodeCount(),
            attr: {
                segmentAngle: node.attr.angle + this.rng.range( -60, -25 ),
            }
        }); }

        return a;
    };

    BushyPlantGenus.prototype.getNodeWidth = function getNodeWidth ( pos, prev, _attr ) {
        if (pos.isOffshoot && prev) { return prev.attr.width; }
        return .1 * (.1 + .9 * pos.branchFactor);
    };
    BushyPlantGenus.prototype.getSegmentLength = function getSegmentLength ( pos, prev, _attr ) {
        if (!prev) { return 1; }
        if (!pos.isOffshoot && pos.branchNum>0) { return prev.attr.length * .75; }
        if (!pos.isOffshoot) { return prev.attr.length; }

        var f = .2 + .8 * (prev.branchRoot.prev ? prev.branchRoot.prev.pos.numFactor : 1);
        return prev.attr.length * f;
    };
    BushyPlantGenus.prototype.getSegmentAngle = function getSegmentAngle ( pos, prev, _attr ) {
        if (pos.branchNum>0) { return plantHelper.nextAngle( this.rng, pos, prev, 16, true ); }
        return plantHelper.nextAngle( this.rng, pos, prev, 8, true );
    };

    BushyPlantGenus.prototype.getSegmentStyle = function getSegmentStyle ( _node0, _node1 ) {
        return this.segmentStyle;
    };

    BushyPlantGenus.prototype.getLeaves = function getLeaves ( _n0, n1 ) {
        var this$1 = this;

        if (n1.pos.branchNum==0 && n1.pos.num<2) { return []; }

        var leaves = [];

        var addLeaf = function (avf) {
            leaves.push({
                angle: n1.attr.angle + (avf ? (avf * this$1.rng.range( 20, 40 )) : this$1.rng.range( -10, 10 )),
                length: this$1.rng.range( .5, .75 ),
                handles: this$1.leafCurveHandles,
                style: this$1.leafStyle,

                xOffset: avf ? -avf * this$1.rng.range( 0, .5) : 0,
                yOffset: avf ? this$1.rng.range( .3, .7 ) : .95,
            });
        };

        if (n1.pos.isLast && this.rng.test( .5 )) { addLeaf( 0 ); }

        if (this.rng.test( .5 )) { addLeaf( 1 ); }
        if (this.rng.test( .5 )) { addLeaf( -1 ); }

        return leaves;
    };

    return BushyPlantGenus;
}(BaseGenus));

var DragonTreeGenus = /*@__PURE__*/(function (BaseGenus) {
    function DragonTreeGenus( rngSeed ) {
        BaseGenus.call( this, rngSeed );

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

    if ( BaseGenus ) DragonTreeGenus.__proto__ = BaseGenus;
    DragonTreeGenus.prototype = Object.create( BaseGenus && BaseGenus.prototype );
    DragonTreeGenus.prototype.constructor = DragonTreeGenus;

    DragonTreeGenus.prototype.getRoots = function getRoots () {
        return [
            {
                n: this.rng.intRange( 2, 4 ),
                attr: plantHelper.rootPosAngle( this.rng, .5, 6 ),
            } ];
    };
    DragonTreeGenus.prototype.getOffshoots = function getOffshoots ( node ) {
        var this$1 = this;

        if (!node.pos.isLast) { return []; }

        var p = .75;
        var steps = { from: -60, to: 60, step: 30 };
        var offshoots = plantHelper.repeat( this.rng, steps, p, function (angle) {
            return {
                n: 2,
                attr: {
                    segmentAngle: node.attr.angle + angle + this$1.rng.range( -10, 10 ),
                }
            };
        });

        if (!offshoots.length) { offshoots.push({
            n: 2,
            attr: {
                segmentAngle: this.rng.range( -60, 60 ),
            }
        }); }

        return offshoots;
    };

    DragonTreeGenus.prototype.getNodeWidth = function getNodeWidth ( pos, prev, _attr ) {
        if (pos.isOffshoot && prev) { return prev.attr.width; }
        if (pos.branchNum == 1) { return this.rng.range( .2, .3 ); }
        return this.rng.range( .4, .6 );
    };
    DragonTreeGenus.prototype.getSegmentLength = function getSegmentLength ( pos, _prev, _attr ) {
        if (pos.branchNum == 1) { return this.rng.range( .2, .8 ); }
        return this.rng.range( .5, 1.5 );
    };
    DragonTreeGenus.prototype.getSegmentAngle = function getSegmentAngle ( pos, prev, _attr ) {
        return plantHelper.nextAngle( this.rng, pos, prev, 8, true );
    };

    DragonTreeGenus.prototype.getSegmentStyle = function getSegmentStyle ( _node0, _node1 ) {
        return this.segmentStyle;
    };

    DragonTreeGenus.prototype.getLeaves = function getLeaves ( _n0, n1 ) {
        var this$1 = this;

        if (!n1.pos.isLast || n1.pos.branchNum != 1) { return []; }

        return plantHelper.repeat( this.rng, { from: -75, to: 75, step: 10 }, .5, function (angle) {
            var av = this$1.rng.range( -5, 5 );
            var sv = this$1.rng.range( -.7, .7 );

            return {
                angle: n1.attr.angle + angle + av,
                length: 3.5 + sv,
                handles: this$1.leafCurveHandles,
                style: this$1.leafStyle,

                xOffset: this$1.rng.range( -.2, .2 ),
                yOffset: this$1.rng.range( .8, .95 ),
            };
        });
    };

    return DragonTreeGenus;
}(BaseGenus));

var ZamiaGenus = /*@__PURE__*/(function (BaseGenus) {
    function ZamiaGenus( rngSeed ) {
        BaseGenus.call( this, rngSeed );

        this.width = 3.6;
        this.height = 3.5;
        this.maxBranchNum = 0;

        this.segmentStyle = {
            stroke: '#041',
            fill: '#161',
            'stroke-width': .0075,
        };

        this.leafStyle = {
            stroke: '#0d5',
            fill: 'rgba(0,255,110,.9)',
            'stroke-width': .01,
        };
        this.leafCurveHandles = {
            bottomAngle: 24,
            bottomLength: .6,
            topAngle: 179,
            topLength: .2,
        };
    }

    if ( BaseGenus ) ZamiaGenus.__proto__ = BaseGenus;
    ZamiaGenus.prototype = Object.create( BaseGenus && BaseGenus.prototype );
    ZamiaGenus.prototype.constructor = ZamiaGenus;

    ZamiaGenus.prototype.getRoots = function getRoots () {
        var this$1 = this;

        return plantHelper.repeat( this.rng, 1, 3, function () {
            return {
                n: this$1.rng.intRange( 5, 7 ),
                attr: Object.assign({}, plantHelper.rootPosAngle( this$1.rng, .25, 15 ),
                    {branchArchAngle: this$1.rng.ranges([ -30, -5 ], [ 5, 30 ])})
            };
        });
    };
    ZamiaGenus.prototype.getOffshoots = function getOffshoots ( _node ) {
        return [];
    };

    ZamiaGenus.prototype.getNodeWidth = function getNodeWidth ( _pos, prev, _attr ) {
        if (!prev) { return .1; }
        return prev.attr.width * .8;
    };
    ZamiaGenus.prototype.getSegmentLength = function getSegmentLength ( _pos, prev, _attr ) {
        if (!prev) { return this.rng.range( .4, 1 ); }
        return prev.attr.length * this.rng.range( .6, .9 );
    };
    ZamiaGenus.prototype.getSegmentAngle = function getSegmentAngle ( pos, prev, _attr ) {
        return plantHelper.archingBranchAngle( this.rng, pos, prev, 5, .6 );
    };

    ZamiaGenus.prototype.getSegmentStyle = function getSegmentStyle ( _node0, _node1 ) {
        return this.segmentStyle;
    };

    ZamiaGenus.prototype.getLeaves = function getLeaves ( _n0, n1 ) {
        var this$1 = this;

        var length = n1.treeRoot.attr.length * 1.2 * (.5 + .5 * Math.sin( Math.PI * n1.pos.numFactor ));
        var angles = n1.pos.isLast ? [ -70, -30, 30, 70 ] : [ -70, 70 ];

        return plantHelper.repeat( this.rng, angles, .89, function (angle) {
            var av = this$1.rng.range( -6, 6 );
            var lv = this$1.rng.range( -.1, .1 );
            var lf = Math.abs( angle ) < 70 ? .9 : 1;

            return {
                angle: n1.attr.angle + angle + av,
                length: length * lf + lv,
                handles: this$1.leafCurveHandles,
                style: this$1.leafStyle,

                xOffset: 0,
                yOffset: 1,
            };
        });
    };

    return ZamiaGenus;
}(BaseGenus));

var PileaGenus = /*@__PURE__*/(function (BaseGenus) {
    function PileaGenus( rngSeed ) {
        BaseGenus.call( this, rngSeed );

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

    if ( BaseGenus ) PileaGenus.__proto__ = BaseGenus;
    PileaGenus.prototype = Object.create( BaseGenus && BaseGenus.prototype );
    PileaGenus.prototype.constructor = PileaGenus;

    PileaGenus.prototype.getRoots = function getRoots () {
        return [{
            n: this.rng.intRange( 0, 3 ),
            attr: plantHelper.rootPosAngle( this.rng, .25, 8 ),
        }];
    };
    PileaGenus.prototype.getOffshoots = function getOffshoots ( node ) {
        var this$1 = this;

        if (node.pos.isLast) { return plantHelper.repeat( this.rng, 1, 12, function () {
            return {
                n: this$1.rng.intRange( 3, 6 ),
                attr: {
                    segmentAngle: node.attr.angle + this$1.rng.range( -40, 40 ),
                    branchArchAngle: this$1.rng.ranges([ -40, -5 ], [ 5, 40 ]),
                }
            };
        }); }

        if (node.pos.num) { return plantHelper.repeat( this.rng, 0, 4, function () {
            return {
                n: this$1.rng.intRange( 2, 3 ),
                attr: {
                    segmentAngle: node.attr.angle + this$1.rng.ranges([ -80, -40 ], [ 40, 80 ]),
                    branchArchAngle: this$1.rng.ranges([ -40, -5 ], [ 5, 40 ]),
                }
            };
        }); }

        return [];
    };

    PileaGenus.prototype.getNodeWidth = function getNodeWidth ( pos, prev, _attr ) {
        if (pos.branchNum == 0) { return this.rng.range( .1, .3 ); }
        if (pos.isOffshoot) { return prev.attr.width; }
        return this.rng.range( .05, .1 );
    };
    PileaGenus.prototype.getSegmentLength = function getSegmentLength ( pos, prev, _attr ) {
        if (!prev) { return this.rng.range( .6, 1.2 ); }
        if (pos.branchNum == 0) { return prev.attr.length * .9; }
        if (pos.isOffshoot) { return this.rng.range( .1, .2 ); }
        if (pos.num == 1) {
            if (prev.branchRoot.pos.isLast) { return this.rng.range( .6, 1.2 ); }
            return this.rng.range( .3, .6 );
        }
        return prev.attr.length * .75;
    };
    PileaGenus.prototype.getSegmentAngle = function getSegmentAngle ( pos, prev, _attr ) {
        if (pos.branchNum == 0) { return this.rng.range( -8, 8 ); }
        return plantHelper.archingBranchAngle( this.rng, pos, prev, 5, .1 );
    };

    PileaGenus.prototype.getSegmentStyle = function getSegmentStyle ( node0, _node1 ) {
        if (node0.pos.branchNum == 0) { return this.segmentStyle.stem; }
        if (node0.pos.isOffshoot) { return this.segmentStyle.offshoot; }
        return this.segmentStyle.branch;
    };

    PileaGenus.prototype.getLeaves = function getLeaves ( n0, n1 ) {
        if (!n1.pos.isLast || n1.pos.branchNum != 1) { return []; }

        var length = (n1.treeRoot.attr.length || 1) * this.rng.range( .4, 1.5 );
        var angle = plantHelper.segmentAngle( n0 ) + this.rng.range( -8, 8 );

        return [{
            angle: angle,
            length: length,
            handles: this.leafCurveHandles,
            style: this.leafStyle,

            xOffset: 0,
            yOffset: .96,
        }];
    };

    return PileaGenus;
}(BaseGenus));

var testPlantBodySize = function (genus, n) {
    if ( n === void 0 ) n=1000;

    var avg = { width: 0, height: 0 };
    var widths = [];
    var heights = [];

    for (var i=0; i<n; i++) {
        var p = (new SvgPlant( new genus )).body;
        p.genus.width = 0;
        p.genus.height = 0;
        p.init();

        avg.width += p.bbox.width;
        avg.height += p.bbox.height;

        widths.push( p.bbox.width );
        heights.push( p.bbox.height );
    }

    widths.sort( function (a,b) { return a - b; } );
    heights.sort( function (a,b) { return a - b; } );

    return {
        avg: {
            width: avg.width / n,
            height: avg.height / n,
        },
        q: function q( q$1 ) {
            var i = Math.max( 0, Math.min( n-1, Math.round( q$1 / 100 * (n-1) ) ) );
            console.log( i );
            return {
                width: widths[ i ],
                height: heights[ i ],
            };
        }
    };
};

var findSeed = function (genus, test, timeoutMs) {
    if ( timeoutMs === void 0 ) timeoutMs=10*1000;

    var cancel = false, n = 0, seed;
    var t0 = Date.now();

    var to = setTimeout(function () {
        cancel = true;
    }, timeoutMs );

    while (true) {
        var p = (new SvgPlant( new genus )).body;
        p.genus.width = 0;
        p.genus.height = 0;
        p.init();
        n++;

        if (test( p )) {
            clearTimeout( to );
            seed = p.genus.rngSeed;
            console.log( 'Seed found!', seed );
            break;
        }

        if (cancel) {
            console.log( 'No seed was found' );
            break;
        }
    }

    var t = ((Date.now() - t0) / 1000 ).toFixed( 2 );
    console.log( 'findSeed finished after ' + t + ' seconds and ' + n + ' tries.' );

    return seed;
};

var testPerformance = function (genus, durationMs) {
    if ( durationMs === void 0 ) durationMs=10*1000;

    var t0 = Date.now();
    var n = 0;

    while (true) {
        var p = (new SvgPlant( new genus )).body;
        p.genus.width = 0;
        p.genus.height = 0;
        p.init();
        n++;

        if (Date.now() - t0 > durationMs) { break; }
    }

    var ms = Date.now() - t0;
    var s = ms / 1000;

    console.group( genus.genusName + ' Performance Test' );
    console.log( 'created ' + n + ' plants in ' + s.toFixed( 2 ) + ' seconds' );
    console.log( (n/s).toFixed(2) + ' plants/sec' );
    console.log( (ms/n).toFixed(2) + ' ms/plant' );
    console.groupEnd();

    return;
};

var DevTools = /*#__PURE__*/Object.freeze({
    __proto__: null,
    testPlantBodySize: testPlantBodySize,
    findSeed: findSeed,
    testPerformance: testPerformance
});

var Genera = {
    'BushyPlant': BushyPlantGenus,
    'DragonTree': DragonTreeGenus,
    'Zamia': ZamiaGenus,
    'Pilea': PileaGenus,
};

exports.BaseGenus = BaseGenus;
exports.BushyPlantGenus = BushyPlantGenus;
exports.DevTools = DevTools;
exports.DragonTreeGenus = DragonTreeGenus;
exports.Genera = Genera;
exports.PileaGenus = PileaGenus;
exports.SvgPlant = SvgPlant;
exports.ZamiaGenus = ZamiaGenus;
exports.plantHelper = plantHelper;
//# sourceMappingURL=svg-plant.min.cjs.js.map
