'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var seedrandom = require('seedrandom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var seedrandom__default = /*#__PURE__*/_interopDefaultLegacy(seedrandom);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
const html = {
  node(tag, set) {
    const node = document.createElement(tag);
    html.attr(node, set);
    return node;
  },

  nodeNS(tag, set, ns) {
    const node = document.createElementNS(ns, tag);
    html.attr(node, set);
    return node;
  },

  attr(node, set = {}) {
    for (let name in set) node.setAttribute(name, String(set[name]));
  },

  svg: {
    root(set) {
      const svg = html.svg.node('svg', set);
      svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      return svg;
    },

    node(tag, set) {
      const el = html.nodeNS(tag, {}, "http://www.w3.org/2000/svg");
      html.attr(el, set);
      return el;
    },

    compilePathDescription(points) {
      const d = [];

      for (const p of points) {
        if (p.length == 1) d.push(p);else if (p.length == 2) d.push(p[0], p[1]);else if (p.length == 3) d.push(p[0], p[1], p[2]);
      }

      return d.join(' ');
    }

  }
};
const math = {
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  fromAngle(point, angle, length, precision) {
    const a = [Math.sin(math.toRadians(angle)) * length + point[0], -Math.cos(math.toRadians(angle)) * length + point[1]];

    if (precision) {
      a[0] = Math.round(a[0] * precision);
      a[1] = Math.round(a[1] * precision);
    }

    return a;
  },

  rectFromLine(pointBottom, pointTop, angleBottom, angleTop, widthBottom, widthTop, precision) {
    widthBottom /= 2;
    widthTop /= 2;
    return [math.fromAngle(pointBottom, angleBottom - 90, widthBottom, precision), math.fromAngle(pointTop, angleTop - 90, widthTop, precision), math.fromAngle(pointTop, angleTop + 90, widthTop, precision), math.fromAngle(pointBottom, angleBottom + 90, widthBottom, precision)];
  },

  pointOnLine(p1, p2, d) {
    return [p1[0] + d * (p2[0] - p1[0]), p1[1] + d * (p2[1] - p1[1])];
  },

  distance(p1, p2) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

};
const plantHelper = {
  rootPosAngle(rng, xMax, maxAngle) {
    const x = rng.range(-xMax, xMax);
    const f = Math.abs(x) / xMax;
    return {
      x,
      segmentAngle: maxAngle * f * (x < 0 ? -1 : 1)
    };
  },

  segmentAngle(baseNode) {
    if (baseNode.attr.segmentAngle !== undefined) return baseNode.attr.segmentAngle;
    return baseNode.attr.angle;
  },

  nextAngle(rng, pos, prevNode, variance, alternate) {
    if (pos.isOffshoot) return prevNode.attr.angle;
    const pa = this.segmentAngle(prevNode);

    if (alternate) {
      const dir = pos.branchNum > 0 ? 1 : prevNode.treeRoot.attr.x >= 0 ? 1 : -1;
      return pa + (prevNode.pos.num % 2 ? 1 : -1) * rng.range(0, variance) * dir;
    } else {
      return pa + rng.range(-variance, variance);
    }
  },

  archingBranchAngle(rng, pos, prevNode, variance, numAdjust) {
    if (pos.isOffshoot) return prevNode.attr.angle;
    const pa = plantHelper.segmentAngle(prevNode);
    const base = prevNode.branchRoot.attr.branchArchAngle;
    const f = numAdjust ? 1 - numAdjust + numAdjust * (1 - pos.numFactor) : 1;
    return pa + f * base + rng.range(-variance, variance);
  },

  repeat({
    rng,
    cb,
    p = 1,
    shuffle = true,
    steps,
    values,
    n
  }) {
    const a = [];
    if (p <= 0) return a;
    const test = p < 1;

    if (values !== undefined) {
      for (let v of values) if (!test || rng.test(p)) {
        a.push(cb(v));
      }
    } else if (steps !== undefined) {
      for (let i = steps.from; i <= steps.to; i += steps.step) if (!test || rng.test(p)) {
        a.push(cb(i));
      }
    } else if (n !== undefined) {
      if (Array.isArray(n)) n = rng.intRange(n[0], n[1]);

      for (let i = 0; i < n; i++) if (!test || rng.test(p)) {
        a.push(cb(i));
      }
    }

    if (shuffle) rng.shuffle(a);
    return a;
  }

};

const rng = seed => {
  const seedStr = seed === undefined ? (Math.random() + '').substring(2) : String(seed);
  let fn;
  const rng = {
    get seed() {
      return seedStr;
    },

    reset() {
      fn = seedrandom__default['default'](seedStr);
    },

    random(v = 1) {
      return fn() * v;
    },

    test(p = .5, pass, fail) {
      const r = p >= 1 ? true : p <= 0 ? false : fn() < p;
      if (r) return pass === undefined ? true : pass;
      return fail === undefined ? false : fail;
    },

    range(v0, v1) {
      if (v0 == v1) return v0;
      return v0 + fn() * (v1 - v0);
    },

    intRange(v0, v1) {
      if (v0 == v1) return v0;
      return v0 + Math.floor(fn() * (v1 - v0 + 1));
    },

    ranges(...ranges) {
      if (!ranges.length) return 0;
      const ep = 1 / ranges.length;
      ranges = [...ranges];
      const last = ranges.pop();

      for (let r of ranges) {
        const p = r[2] || ep;
        if (rng.test(p)) return rng.range(r[0], r[1]);
      }

      return last ? rng.range(last[0], last[1]) : 0;
    },

    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(fn() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }

      return a;
    }

  };
  rng.reset();
  return rng;
};

class BBox {
  constructor(data) {
    defineProperty(this, "x0", void 0);

    defineProperty(this, "x1", void 0);

    defineProperty(this, "y0", void 0);

    defineProperty(this, "y1", void 0);

    if (data) {
      this.x0 = data.x0;
      this.x1 = data.x1;
      this.y0 = data.y0;
      this.y1 = data.y1;
    } else {
      this.x0 = Infinity;
      this.x1 = -Infinity;
      this.y0 = Infinity;
      this.y1 = -Infinity;
    }
  }

  addX(v) {
    if (v < this.x0) this.x0 = v;
    if (v > this.x1) this.x1 = v;
    return this;
  }

  addY(v) {
    if (v < this.y0) this.y0 = v;
    if (v > this.y1) this.y1 = v;
    return this;
  }

  addPoint(x, y) {
    this.addX(x);
    this.addY(y);
    return this;
  }

  addBBox(bbox) {
    this.addX(bbox.x0);
    this.addX(bbox.x1);
    this.addY(bbox.y0);
    this.addY(bbox.y1);
    return this;
  }

  expand(v) {
    this.x0 -= v;
    this.x1 += v;
    this.y0 -= v;
    this.y1 += v;
    return this;
  }

  contains(bbox, strict) {
    if (strict) return this.x0 < bbox.x0 && this.x1 > bbox.x1 && this.y0 < bbox.y0 && this.y1 > bbox.y1;
    return this.x0 <= bbox.x0 && this.x1 >= bbox.x1 && this.y0 <= bbox.y0 && this.y1 >= bbox.y1;
  }

  containedBy(bbox, strict) {
    if (strict) return this.x0 > bbox.x0 && this.x1 < bbox.x1 && this.y0 > bbox.y0 && this.y1 < bbox.y1;
    return this.x0 >= bbox.x0 && this.x1 <= bbox.x1 && this.y0 >= bbox.y0 && this.y1 <= bbox.y1;
  }

  containsPoint(x, y, strict) {
    if (strict) return !(x <= this.x0 || x >= this.x1 || y <= this.y0 || y >= this.y1);
    return !(x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1);
  }

  clone() {
    return new BBox(this.data);
  }

  withPrecision(p) {
    return new BBox({
      x0: Math.round(this.x0 * p),
      x1: Math.round(this.x1 * p),
      y0: Math.round(this.y0 * p),
      y1: Math.round(this.y1 * p)
    });
  }

  get width() {
    return this.x1 - this.x0;
  }

  get height() {
    return this.y1 - this.y0;
  }

  get aspectRatio() {
    if (!this.height) return 0;
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
    return [[this.x0, this.y0], [this.x1, this.y1]];
  }

  get viewBox() {
    return "".concat(this.x0, " ").concat(this.y0, " ").concat(this.width, " ").concat(this.height);
  }

}

class ProcTree {
  constructor(maxBranchNum, getNode, getOffshoots) {
    defineProperty(this, "maxBranchNum", void 0);

    defineProperty(this, "getNode", void 0);

    defineProperty(this, "getOffshoots", void 0);

    defineProperty(this, "roots", void 0);

    this.maxBranchNum = maxBranchNum;
    this.getNode = getNode;
    this.getOffshoots = getOffshoots;
    this.roots = [];
  }

  grow() {
    const roots = this.getOffshoots(null);

    for (let i in roots) this.growBranch(null, Number(i), roots[i].n, roots[i].attr || {});
  }

  growBranch(rootNode, offshootNum, segmentCount, attr) {
    const isTreeRoot = !rootNode;
    let node = this.addNode(rootNode, true, offshootNum, segmentCount, attr);
    if (isTreeRoot) this.roots.push(node);
    const isLastBranch = this.maxBranchNum == node.pos.branchNum;

    if (!isLastBranch && isTreeRoot) {
      const offshoots = this.getOffshoots(node);

      for (let i in offshoots) this.growBranch(node, Number(i), offshoots[i].n, offshoots[i].attr || {});
    }

    for (let i = 0; i < segmentCount; i++) {
      node = this.addNode(node, false, offshootNum, segmentCount, {});

      if (!isLastBranch) {
        const offshoots = this.getOffshoots(node);

        for (let i in offshoots) this.growBranch(node, Number(i), offshoots[i].n, offshoots[i].attr || {});
      }
    }
  }

  addNode(prev, isOffshoot, offshootNum, maxNum, rootAttr) {
    const pos = this.getPos(prev ? prev.pos : null, isOffshoot, maxNum);
    const node = {
      pos,
      attr: _objectSpread(_objectSpread({}, rootAttr), this.getNode(pos, prev, rootAttr)),
      offshoots: [],
      prev: null,
      next: null,
      branchRoot: {},
      treeRoot: {},
      offshootNum: 0
    };

    if (prev) {
      node.prev = prev;
      node.branchRoot = isOffshoot ? node : prev.pos.isOffshoot ? prev : prev.branchRoot;
      node.treeRoot = prev.treeRoot ? prev.treeRoot : prev;

      if (isOffshoot) {
        prev.offshoots.push(node);
        node.offshootNum = offshootNum;
      } else {
        prev.next = node;
      }
    } else {
      node.branchRoot = node;
      node.treeRoot = node;
      node.offshootNum = offshootNum;
    }

    return node;
  }

  getPos(prev, isOffshoot, maxNum) {
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
      branchFactor: 1
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
      numFactor: 0,
      branchFactor: 0
    };
    if (pos.num == maxNum) pos.isLast = true;
    if (pos.branchNum == this.maxBranchNum) pos.isLastBranch = true;
    pos.numFactor = maxNum ? 1 - pos.num / maxNum : 1;
    pos.branchFactor = this.maxBranchNum ? 1 - pos.branchNum / this.maxBranchNum : 1;
    return pos;
  }

  eachSegment(cb) {
    for (let node of this.roots) this._each(node, cb);
  }

  _each(node, cb) {
    // note: the treeRoot node can have offshoots
    // other nodes that are branchRoots cannot have offshoots
    while (node) {
      if (node.pos.num > 0 && node.prev) cb(node.prev, node);

      for (let offshootNode of node.offshoots) this._each(offshootNode.next, cb);

      node = node.next;
    }
  }

}

function plantPotSvg(pathAttr) {
  const baseCfg = {
    rimHeight: 20,
    rimLipOuter: 2,
    rimLipInner: 4,
    bottom: 15
  };
  const sw = pathAttr ? 'stroke-width' in pathAttr ? pathAttr['stroke-width'] : 2 : false;
  if (sw) pathAttr['stroke-width'] = sw;
  const pad = sw && typeof sw == 'number' ? sw / 2 : 0;

  const getPoints = cfg => {
    return [['M', pad, pad], ['L', 100 - pad, pad], ['L', 100 - pad - cfg.rimLipOuter, cfg.rimHeight], ['L', 100 - pad - cfg.rimLipInner, cfg.rimHeight], ['L', 100 - pad - cfg.bottom, 100 - pad], ['L', pad + cfg.bottom, 100 - pad], ['L', pad + cfg.rimLipInner, cfg.rimHeight], ['L', pad + cfg.rimLipOuter, cfg.rimHeight], 'Z'];
  };

  if (!pathAttr) pathAttr = {};
  pathAttr.d = html.svg.compilePathDescription(getPoints(baseCfg));
  const path = html.svg.node('path', pathAttr);
  const svg = html.svg.root({
    class: 'svg-plant-pot',
    viewBox: '0 0 100 100',
    preserveAspectRatio: 'xMidYMax meet'
  });
  svg.appendChild(path);
  return svg;
}

// ripped from https://github.com/kfitfk/svg-boundings
/**
 * expand the x-bounds, if the value lies outside the bounding box
 */

function expandXBounds(bounds, value) {
  if (bounds.minX > value) bounds.minX = value;else if (bounds.maxX < value) bounds.maxX = value;
}
/**
 * expand the y-bounds, if the value lies outside the bounding box
 */


function expandYBounds(bounds, value) {
  if (bounds.minY > value) bounds.minY = value;else if (bounds.maxY < value) bounds.maxY = value;
}
/**
 * Calculate the bezier value for one dimension at distance 't'
 */


function calculateBezier(t, p0, p1, p2, p3) {
  var mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}
/**
 * Calculate the bounding box for this bezier curve.
 * http://pomax.nihongoresources.com/pages/bezier/
 */


function bezierCurveBoundingBox(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
  var bounds = {
    minX: Math.min(x1, x2),
    minY: Math.min(y1, y2),
    maxX: Math.max(x1, x2),
    maxY: Math.max(y1, y2)
  };
  var dcx0 = cx1 - x1;
  var dcy0 = cy1 - y1;
  var dcx1 = cx2 - cx1;
  var dcy1 = cy2 - cy1;
  var dcx2 = x2 - cx2;
  var dcy2 = y2 - cy2;

  if (cx1 < bounds.minX || cx1 > bounds.maxX || cx2 < bounds.minX || cx2 > bounds.maxX) {
    // Just for better reading because we are doing middle school math here
    var a = dcx0;
    var b = dcx1;
    var c = dcx2;
    if (a + c !== 2 * b) b += 0.0001;
    var numerator = 2 * (a - b);
    var denominator = 2 * (a - 2 * b + c);
    if (denominator === 0) denominator = 0.0001;
    var quadroot = (2 * b - 2 * a) * (2 * b - 2 * a) - 2 * a * denominator;
    var root = Math.sqrt(quadroot);
    var t1 = (numerator + root) / denominator;
    var t2 = (numerator - root) / denominator;

    if (0 < t1 && t1 < 1) {
      expandXBounds(bounds, calculateBezier(t1, x1, cx1, cx2, x2));
    }

    if (0 < t2 && t2 < 1) {
      expandXBounds(bounds, calculateBezier(t2, x1, cx1, cx2, x2));
    }
  }

  if (cy1 < bounds.minY || cy1 > bounds.maxY || cy2 < bounds.minY || cy2 > bounds.maxY) {
    a = dcy0;
    b = dcy1;
    c = dcy2;
    if (a + c !== 2 * b) b += 0.0001;
    numerator = 2 * (a - b);
    denominator = 2 * (a - 2 * b + c);
    if (denominator === 0) denominator = 0.0001;
    quadroot = (2 * b - 2 * a) * (2 * b - 2 * a) - 2 * a * denominator;
    root = Math.sqrt(quadroot);
    t1 = (numerator + root) / denominator;
    t2 = (numerator - root) / denominator;

    if (0 < t1 && t1 < 1) {
      expandYBounds(bounds, calculateBezier(t1, y1, cy1, cy2, y2));
    }

    if (0 < t2 && t2 < 1) {
      expandYBounds(bounds, calculateBezier(t2, y1, cy1, cy2, y2));
    }
  }

  return {
    x0: bounds.minX,
    x1: bounds.maxX,
    y0: bounds.minY,
    y1: bounds.maxY
  };
}

const precision = 10000;

function prc(v) {
  if (Array.isArray(v)) return [Math.round(v[0] * precision), Math.round(v[1] * precision)];
  return Math.round(v * precision);
}

class BranchSegment {
  constructor(base, style, n0, n1) {
    defineProperty(this, "base", void 0);

    defineProperty(this, "top", void 0);

    defineProperty(this, "bottomWidth", void 0);

    defineProperty(this, "topWidth", void 0);

    defineProperty(this, "angle", void 0);

    defineProperty(this, "bottomAngle", void 0);

    defineProperty(this, "topAngle", void 0);

    defineProperty(this, "length", void 0);

    defineProperty(this, "ageOffset", void 0);

    defineProperty(this, "style", void 0);

    defineProperty(this, "bbox", void 0);

    this.base = base;
    this.bottomWidth = n0.attr.width;
    this.topWidth = n1.attr.width;
    this.angle = n0.attr.segmentAngle !== undefined ? n0.attr.segmentAngle : n0.attr.angle;
    this.bottomAngle = n0.attr.angle;
    this.topAngle = n1.attr.angle;
    this.length = n0.attr.length;
    this.top = math.fromAngle(this.base, this.angle, this.length);
    this.ageOffset = n0.attr.totalLength;
    this.style = style;
    this.bbox = this.getBoundingBox();
  }

  getPoints(age) {
    const ageFactor = this.getAgeFactor(age);
    if (!ageFactor) return;
    let top = this.top;

    if (ageFactor < 1) {
      top = math.fromAngle(this.base, this.angle, this.length * ageFactor);
    }

    const r = math.rectFromLine(this.base, top, this.bottomAngle, this.topAngle, this.bottomWidth, this.topWidth, precision);
    return ['M', r[0], 'L', r[1], 'L', r[2], 'L', r[3], 'Z'];
  }

  getBoundingBox() {
    const points = math.rectFromLine(this.base, this.top, this.bottomAngle, this.topAngle, this.bottomWidth, this.topWidth, undefined);
    const bb = new BBox();
    bb.addPoint(points[0][0], points[0][1]);
    bb.addPoint(points[1][0], points[1][1]);
    bb.addPoint(points[2][0], points[2][1]);
    bb.addPoint(points[3][0], points[3][1]);
    return bb;
  }

  getAgeFactor(age) {
    if (age <= this.ageOffset) return 0;
    if (age >= this.ageOffset + this.length) return 1;
    return (age - this.ageOffset) / this.length;
  }

  getOffsetPoint(x, y) {
    if (!x) {
      if (!y) return this.base;
      if (y == 1) return this.top;
      return math.fromAngle(this.base, this.angle, this.length * y);
    }

    const dir = this.angle < 0 ? 1 : -1;

    if (!y) {
      return math.fromAngle(this.base, this.bottomAngle + 90 * dir, this.bottomWidth / 2 * x);
    }

    if (y == 1) {
      return math.fromAngle(this.top, this.topAngle + 90 * dir, this.topWidth / 2 * x);
    }

    const l1 = [math.fromAngle(this.base, this.bottomAngle + 90 * dir, this.bottomWidth / 2), math.fromAngle(this.top, this.topAngle + 90 * dir, this.topWidth / 2)];
    const l2 = [math.fromAngle(this.base, this.bottomAngle + 90 * dir, -this.bottomWidth / 2), math.fromAngle(this.top, this.topAngle + 90 * dir, -this.topWidth / 2)];
    const l3 = [math.pointOnLine(l1[0], l1[1], y), math.pointOnLine(l2[0], l2[1], y)];
    x = 1 - (x / 2 + .5);
    return math.pointOnLine(l3[0], l3[1], x);
  }

}

class Leaf {
  constructor(segment, {
    angle,
    length,
    handles,
    style,
    xOffset,
    yOffset
  }) {
    defineProperty(this, "base", void 0);

    defineProperty(this, "pBase", void 0);

    defineProperty(this, "top", void 0);

    defineProperty(this, "angle", void 0);

    defineProperty(this, "length", void 0);

    defineProperty(this, "handles", void 0);

    defineProperty(this, "ageOffset", void 0);

    defineProperty(this, "style", void 0);

    defineProperty(this, "bbox", void 0);

    const base = segment.getOffsetPoint(xOffset, yOffset);
    this.base = base;
    this.pBase = prc(base);
    this.angle = angle;
    this.length = length;
    this.handles = handles;
    this.top = math.fromAngle(base, angle, length);
    this.ageOffset = segment.ageOffset + segment.length * yOffset;
    this.style = style;
    this.bbox = this.getBoundingBox();
  }

  getPoints(age) {
    const ageFactor = this.getAgeFactor(age);
    if (!ageFactor) return;
    let top = this.top;

    if (ageFactor < 1) {
      top = math.fromAngle(this.base, this.angle, this.length * ageFactor);
    }

    const curves = this.getCurves({
      top,
      ageFactor,
      precision
    });
    top = prc(top);
    return ['M', this.pBase, 'C', curves.up[0], curves.up[1], top, 'C', curves.down[0], curves.down[1], this.pBase];
  }

  getBoundingBox() {
    const c = this.getCurves({
      top: this.top,
      ageFactor: 1
    });
    const bb = new BBox(bezierCurveBoundingBox(this.base[0], this.base[1], c.up[0][0], c.up[0][1], c.up[1][0], c.up[1][1], this.top[0], this.top[1]));
    bb.addBBox(bezierCurveBoundingBox(this.top[0], this.top[1], c.down[0][0], c.down[0][1], c.down[1][0], c.down[1][1], this.base[0], this.base[1]));
    if (typeof this.style['stroke-width'] == 'number') bb.expand(this.style['stroke-width'] / 2);
    return bb;
  }

  getCurves({
    top,
    ageFactor,
    precision
  }) {
    const bha = this.handles.bottomAngle;
    const bhl = this.handles.bottomLength * ageFactor;
    const tha = this.handles.topAngle;
    const thl = this.handles.topLength * ageFactor;
    return {
      up: [math.fromAngle(this.base, this.angle + bha, this.length * bhl, precision), math.fromAngle(top, this.angle + tha, this.length * thl, precision)],
      down: [math.fromAngle(top, this.angle - tha, this.length * thl, precision), math.fromAngle(this.base, this.angle - bha, this.length * bhl, precision)]
    };
  }

  getAgeFactor(age) {
    if (age <= this.ageOffset) return 0;
    if (age >= this.ageOffset + this.length) return 1;
    return (age - this.ageOffset) / this.length;
  }

}

class Branches {
  constructor() {
    defineProperty(this, "segments", void 0);

    defineProperty(this, "leaves", void 0);

    this.segments = [];
    this.leaves = [];
  }

  addSegment(branchNum, segment) {
    let branch = this.segments[branchNum];

    if (!branch) {
      branch = [];
      this.segments[branchNum] = branch;
    }

    branch.push(segment);
  }

  addLeaf(branchNum, leaf) {
    let branch = this.leaves[branchNum];

    if (!branch) {
      branch = [];
      this.leaves[branchNum] = branch;
    }

    branch.push(leaf);
  }

  getArray() {
    let ret = [];

    for (let i = 0; i < this.segments.length; i++) {
      ret = ret.concat(this.segments[i] || []);
      ret = ret.concat(this.sortLeaves(this.leaves[i]));
    }

    return ret;
  }

  sortLeaves(a) {
    if (!a) return [];
    return a.sort((l0, l1) => {
      if (l1.bbox.containsPoint(l0.base[0], l0.base[1], true)) {
        return -1;
      }

      if (l0.bbox.containsPoint(l1.base[0], l1.base[1], true)) {
        return 1;
      }

      const d0 = math.distance(l0.base, [0, 0]);
      const d1 = math.distance(l1.base, [0, 0]);
      return d1 - d0;
    });
  }

}

class PlantBody {
  constructor(genus) {
    defineProperty(this, "genus", void 0);

    defineProperty(this, "bbox", void 0);

    defineProperty(this, "yFactor", void 0);

    defineProperty(this, "parts", void 0);

    defineProperty(this, "maxAge", void 0);

    this.genus = genus;
    this.bbox = new BBox();
    this.maxAge = 0;
    this.yFactor = 1;
  }

  getTree() {
    const getNodeAttr = (pos, prev, attr) => {
      return {
        width: this.genus.getNodeWidth(pos, prev, attr),
        angle: prev ? this.genus.getSegmentAngle(pos, prev, attr) : 0,
        length: pos.isLast ? prev ? prev.attr.length : 0 : this.genus.getSegmentLength(pos, prev, attr),
        totalLength: prev ? (pos.isOffshoot ? 0 : prev.attr.length) + prev.attr.totalLength : 0
      };
    };

    const getOffshoots = node => {
      if (node === null) return this.genus.getRoots();
      return this.genus.getOffshoots(node);
    };

    return new ProcTree(this.genus.maxBranchNum, getNodeAttr, getOffshoots);
  }

  init() {
    this.genus.reset();
    const tree = this.getTree();
    tree.grow();
    this.bbox = new BBox({
      x0: -this.genus.width / 2,
      x1: this.genus.width / 2,
      y0: -this.genus.height,
      y1: 0
    });
    const branches = new Branches();
    const points = new Map();
    let maxAge = 0;

    const getBasePoint = node => {
      if (!node.prev) {
        const p = [node.attr.x || 0, 0];
        this.bbox.addPoint(p[0], p[1]);
        return p;
      } else if (node.pos.isOffshoot) {
        const p = points.get(node.prev);
        if (p) return p;
        const rp = [node.prev.attr.x || 0, 0];
        points.set(node.prev, rp);
        this.bbox.addPoint(rp[0], rp[1]);
        return rp;
      }

      return points.get(node);
    };

    tree.eachSegment((n0, n1) => {
      const base = getBasePoint(n0);
      const style = this.genus.getSegmentStyle(n0, n1);
      const s = new BranchSegment(base, style, n0, n1);
      points.set(n1, s.top);
      this.bbox.addBBox(s.bbox);
      branches.addSegment(n0.pos.branchNum, s);
      this.genus.getLeaves(n0, n1).map(cfg => {
        const leaf = new Leaf(s, cfg);
        this.bbox.addBBox(leaf.bbox);
        branches.addLeaf(n0.pos.branchNum, leaf);
        if (leaf.ageOffset + leaf.length > maxAge) maxAge = leaf.ageOffset + leaf.length;
      });
      if (n1.attr.totalLength > maxAge) maxAge = n1.attr.totalLength;
    });
    this.parts = branches.getArray();
    this.maxAge = maxAge; // make sure the plant is centered

    const bboxX = Math.max(Math.abs(this.bbox.x0), Math.abs(this.bbox.x1));
    this.bbox.x0 = -bboxX;
    this.bbox.x1 = bboxX;
    this.yFactor = this.bbox.height / -this.bbox.y0 || 1;
  }

  render(age, colors = true, svg) {
    age *= this.maxAge;
    if (this.parts) for (const p of this.parts) {
      const points = p.getPoints(age);
      if (!points) continue;
      let style = {},
          add = {};

      if (colors) {
        style = p.style;
        add = {};
        if (typeof style['stroke-width'] == 'number') add['stroke-width'] = prc(style['stroke-width']);
      }

      const set = Object.assign({}, style, add, {
        d: html.svg.compilePathDescription(points)
      });
      svg.appendChild(html.svg.node('path', set));
    }
  }

  getSvg(age, colors) {
    if (this.parts === undefined) this.init();
    const svg = html.svg.root({
      class: 'svg-plant-body',
      viewBox: this.bbox.withPrecision(precision).viewBox,
      preserveAspectRatio: 'xMidYMax meet'
    });
    this.render(age, colors, svg);
    return svg;
  }

}

class SvgPlant {
  constructor(genus, cfg) {
    defineProperty(this, "body", void 0);

    defineProperty(this, "cfg", void 0);

    defineProperty(this, "_svgElement", void 0);

    defineProperty(this, "_potSvgElement", void 0);

    defineProperty(this, "_bodySvgElement", void 0);

    defineProperty(this, "animation", void 0);

    this.cfg = {
      color: true,
      age: 1,
      potSize: .3,
      potPathAttr: {
        fill: '#fc7',
        stroke: '#da5'
      }
    };

    if (typeof cfg == 'object') {
      if (cfg.color !== undefined) this.color = cfg.color;
      if (cfg.age !== undefined) this.age = cfg.age;
      if (cfg.potSize !== undefined) this.potSize = cfg.potSize;
      if (cfg.potPathAttr !== undefined) this.potPathAttr = cfg.potPathAttr;
    }

    this.body = new PlantBody(genus);
    this._svgElement = null;
    this._potSvgElement = null;
    this._bodySvgElement = null;
    this.animation = null;
  }

  get seed() {
    return this.body.genus.rngSeed;
  }

  get color() {
    return this.cfg.color;
  }

  set color(v) {
    v = !!v;

    if (v != this.cfg.color) {
      this.cfg.color = v;
      this.update();
    }
  }

  get age() {
    return this.cfg.age;
  }

  set age(v) {
    v = Math.max(0, Math.min(v, 1));

    if (v != this.cfg.age) {
      this.cfg.age = v;
      this.update(true, false);
    }
  }

  get potSize() {
    return this.cfg.potSize;
  }

  set potSize(v) {
    v = Math.max(0, Math.min(v, 1));

    if (v != this.cfg.potSize) {
      this.cfg.potSize = v;
      this.update(false, true);
    }
  }

  get potPathAttr() {
    return this.cfg.potPathAttr;
  }

  set potPathAttr(v) {
    if (v !== this.cfg.potPathAttr) {
      this.cfg.potPathAttr = v;
      this.update(false, true);
    }
  }

  update(body = true, pot = true) {
    if (body) this._bodySvgElement = null;
    if (pot) this._potSvgElement = null;
    this.updateSvgElement();
  }

  get svgElement() {
    if (!this._svgElement) {
      this._svgElement = this.getSvgElement();
    }

    return this._svgElement;
  }

  updateSvgElement() {
    const svg = this._svgElement;
    if (!svg) return;
    svg.innerHTML = this.getSvgElement().innerHTML;
  }

  getSvgElement() {
    const svg = html.svg.root({
      class: 'svg-plant',
      viewBox: '0 0 1 1',
      preserveAspectRatio: 'xMidYMax meet'
    });

    const place = (el, x, y, w, h) => {
      el.setAttribute('x', String(x));
      el.setAttribute('y', String(y));
      el.setAttribute('width', String(w));
      el.setAttribute('height', String(h));
    };

    const pot = this.potSvgElement;
    const body = this.bodySvgElement;

    if (this.cfg.potSize >= 1 && pot !== null) {
      svg.appendChild(pot);
      place(pot, 0, 0, 1, 1);
    } else if (this.cfg.potSize <= 0 && body !== null) {
      svg.appendChild(body);
      place(body, 0, 0, 1, 1);
    } else if (pot && body) {
      svg.appendChild(pot);
      place(pot, 0, 1 - this.cfg.potSize, 1, this.cfg.potSize);
      svg.appendChild(body); // with high contrast there is a slight gap visible, between pot and plant.
      // without color this is way more noticable, and the slight overlap is invisible.

      const overlap = this.cfg.color ? 0 : .001;
      let height;
      const bodyHeight = 1 - this.cfg.potSize;

      if (this.body.yFactor > 1) {
        // this means the plant has points "below the fold"
        // or: points that overlap the potsize area
        // so the height of "1 - this._cfg.potSize" needs to be expanded accordingly
        const wrapperAR = 1 / bodyHeight;
        const aboveFoldBodyAR = this.body.bbox.width / -this.body.bbox.y0;

        if (wrapperAR < aboveFoldBodyAR) {
          // the plantbody is scaled down, to fit the viewbox's width
          // the yFactor now needs to be applied only to the plants scaled down height
          // not the full available area of "1 - this._cfg.potSize"
          const scaledBodyHeight = -this.body.bbox.y0 / this.body.bbox.width;
          height = bodyHeight + (scaledBodyHeight * this.body.yFactor - scaledBodyHeight);
        } else {
          height = bodyHeight * this.body.yFactor;
        }
      } else {
        height = bodyHeight;
      }

      place(body, 0, 0, 1, height + overlap);
    }

    return svg;
  }

  get potSvgElement() {
    if (this.cfg.potSize == 0) return null;

    if (!this._potSvgElement) {
      this._potSvgElement = this.getPotSvgElement();
    }

    return this._potSvgElement;
  }

  getPotSvgElement() {
    if (!this.cfg.color) return plantPotSvg({});
    return plantPotSvg(this.cfg.potPathAttr);
  }

  get bodySvgElement() {
    if (this.cfg.potSize == 1) return null;

    if (!this._bodySvgElement) {
      this._bodySvgElement = this.getBodySvgElement();
    }

    return this._bodySvgElement;
  }

  getBodySvgElement() {
    return this.body.getSvg(this.cfg.age, this.cfg.color);
  }

  animate(fromAge = 0, toAge = 1, durationMs = 3000) {
    this.cancelAnimation();
    this.animation = {
      fromAge,
      toAge,
      ageSpan: toAge - fromAge,
      currentAge: fromAge,
      durationMs,
      nextAnimationFrame: undefined,
      paused: true
    };
    this.resumeAnimation();
  }

  pauseAnimation() {
    if (this.animation) {
      if (this.animation.nextAnimationFrame !== undefined) {
        cancelAnimationFrame(this.animation.nextAnimationFrame);
      }

      this.animation.paused = true;
    }
  }

  cancelAnimation() {
    this.pauseAnimation();
    this.animation = null;
  }

  resumeAnimation() {
    const a = this.animation;
    if (!a || !a.paused) return;
    a.paused = false;
    this.age = a.currentAge;

    const acl = t => t < 0 ? 0 : t > 1 ? 1 : Math.sin((t - .5) * Math.PI) * .5 + .5;

    const aclInv = t => t < 0 ? 0 : t > 1 ? 1 : Math.asin(t * 2 - 1) / Math.PI + .5;

    let t0;

    const upd = ts => {
      if (!t0) {
        const f = (a.currentAge - a.fromAge) / a.ageSpan;
        t0 = ts - aclInv(f) * a.durationMs;
        a.nextAnimationFrame = requestAnimationFrame(upd);
      } else {
        const f = acl(Math.min(1, (ts - t0) / a.durationMs));

        if (f < 1) {
          this.cfg.age = a.fromAge + f * a.ageSpan;
          a.currentAge = this.cfg.age;
          this._bodySvgElement = null;
          this.updateSvgElement();
          a.nextAnimationFrame = requestAnimationFrame(upd);
        } else {
          this.age = a.toAge;
          this.animation = null;
        }
      }
    };

    a.nextAnimationFrame = requestAnimationFrame(upd);
  }

}

class BaseGenus {
  constructor(rngSeed) {
    defineProperty(this, "rng", void 0);

    defineProperty(this, "width", void 0);

    defineProperty(this, "height", void 0);

    defineProperty(this, "maxBranchNum", void 0);

    defineProperty(this, "segmentStyle", void 0);

    defineProperty(this, "leafStyle", void 0);

    defineProperty(this, "leafCurveHandles", void 0);

    this.rng = rng(rngSeed);
    this.width = 4;
    this.height = 4;
    this.maxBranchNum = 1;
    this.segmentStyle = {
      fill: '#161',
      stroke: '#041',
      'stroke-width': .0075
    };
    this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    this.leafCurveHandles = {
      bottomAngle: 60,
      bottomLength: .6,
      topAngle: 179,
      topLength: .2
    };
  }

  static get genusName() {
    const cn = this.name;
    return cn.substring(0, cn.length - 5);
  }

  get genusName() {
    const cn = this.constructor.name;
    return cn.substring(0, cn.length - 5);
  }

  get rngSeed() {
    return this.rng.seed;
  }

  reset() {
    this.rng.reset();
  }

  getRoots() {
    return [{
      n: 3,
      attr: {
        x: 0,
        segmentAngle: 0
      }
    }];
  }

  getOffshoots(node) {
    if (node.pos.isLast || node.pos.num == 0) return [];
    return [{
      n: 1,
      attr: {
        segmentAngle: node.attr.angle - 60
      }
    }, {
      n: 1,
      attr: {
        segmentAngle: node.attr.angle + 60
      }
    }];
  }

  getNodeWidth(_pos, _prev, _attr) {
    return .1;
  }

  getSegmentLength(_pos, _prev, _attr) {
    return 1;
  }

  getSegmentAngle(pos, prev, _attr) {
    if (pos.isOffshoot) return prev.attr.angle;
    return prev.attr.segmentAngle !== undefined ? prev.attr.segmentAngle : prev.attr.angle;
  }

  getSegmentStyle(_n0, _n1) {
    return this.segmentStyle;
  }

  getLeaves(_n0, n1) {
    if (!n1.pos.isLast) return [];
    return [{
      angle: n1.attr.angle,
      length: 1,
      handles: this.leafCurveHandles,
      style: this.leafStyle,
      xOffset: 0,
      yOffset: .95
    }];
  }

}

class BushyPlantGenus extends BaseGenus {
  constructor(rngSeed) {
    super(rngSeed);
    this.width = 6.1;
    this.height = 6.6;
    this.maxBranchNum = 3;
    this.segmentStyle = {
      fill: '#400',
      stroke: '#931',
      'stroke-width': .0075
    };
    this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    this.leafCurveHandles = {
      bottomAngle: 60,
      bottomLength: .6,
      topAngle: 179,
      topLength: .2
    };
  }

  getRoots() {
    return [{
      n: this.rng.intRange(4, 6),
      attr: plantHelper.rootPosAngle(this.rng, .5, 6)
    }];
  }

  getOffshoots(node) {
    if (node.pos.isLast || node.pos.num == 0) return [];
    const p = .5 * (.5 + .5 * node.pos.numFactor) * (.5 + .5 * node.pos.branchFactor);
    const a = [];

    const getNodeCount = () => 4 - node.pos.branchNum - this.rng.test(.6, 1, 0);

    if (this.rng.test(p)) a.push({
      n: getNodeCount(),
      attr: {
        segmentAngle: node.attr.angle + this.rng.range(25, 60)
      }
    });
    if (this.rng.test(p)) a.push({
      n: getNodeCount(),
      attr: {
        segmentAngle: node.attr.angle + this.rng.range(-60, -25)
      }
    });
    return a;
  }

  getNodeWidth(pos, prev, _attr) {
    if (pos.isOffshoot && prev) return prev.attr.width;
    return .1 * (.1 + .9 * pos.branchFactor);
  }

  getSegmentLength(pos, prev, _attr) {
    if (!prev) return 1;
    if (!pos.isOffshoot && pos.branchNum > 0) return prev.attr.length * .75;
    if (!pos.isOffshoot) return prev.attr.length;
    const f = .2 + .8 * (prev.branchRoot.prev ? prev.branchRoot.prev.pos.numFactor : 1);
    return prev.attr.length * f;
  }

  getSegmentAngle(pos, prev, _attr) {
    if (pos.branchNum > 0) return plantHelper.nextAngle(this.rng, pos, prev, 16, true);
    return plantHelper.nextAngle(this.rng, pos, prev, 8, true);
  }

  getSegmentStyle(_n0, _n1) {
    return this.segmentStyle;
  }

  getLeaves(_n0, n1) {
    if (n1.pos.branchNum == 0 && n1.pos.num < 2) return [];
    const leaves = [];

    const addLeaf = avf => {
      leaves.push({
        angle: n1.attr.angle + (avf ? avf * this.rng.range(20, 40) : this.rng.range(-10, 10)),
        length: this.rng.range(.5, .75),
        handles: this.leafCurveHandles,
        style: this.leafStyle,
        xOffset: avf ? -avf * this.rng.range(0, .5) : 0,
        yOffset: avf ? this.rng.range(.3, .7) : .95
      });
    };

    if (n1.pos.isLast && this.rng.test(.5)) addLeaf(0);
    if (this.rng.test(.5)) addLeaf(1);
    if (this.rng.test(.5)) addLeaf(-1);
    return leaves;
  }

}

class DragonTreeGenus extends BaseGenus {
  constructor(rngSeed) {
    super(rngSeed);
    this.width = 10.3;
    this.height = 8.6;
    this.maxBranchNum = 1;
    this.segmentStyle = {
      fill: '#400',
      stroke: '#931',
      'stroke-width': .0075
    };
    this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    this.leafCurveHandles = {
      bottomAngle: 30,
      bottomLength: .2,
      topAngle: 179,
      topLength: .2
    };
  }

  getRoots() {
    return [{
      n: this.rng.intRange(2, 4),
      attr: plantHelper.rootPosAngle(this.rng, .5, 6)
    }];
  }

  getOffshoots(node) {
    if (!node.pos.isLast) return [];
    const p = .75;
    const steps = {
      from: -60,
      to: 60,
      step: 30
    };

    const makeOffshoot = angle => {
      return {
        n: 2,
        attr: {
          segmentAngle: node.attr.angle + angle + this.rng.range(-10, 10)
        }
      };
    };

    const offshoots = plantHelper.repeat({
      rng: this.rng,
      steps,
      p,
      cb: makeOffshoot
    });
    if (!offshoots.length) offshoots.push({
      n: 2,
      attr: {
        segmentAngle: this.rng.range(-60, 60)
      }
    });
    return offshoots;
  }

  getNodeWidth(pos, prev, _attr) {
    if (pos.isOffshoot && prev) return prev.attr.width;
    if (pos.branchNum == 1) return this.rng.range(.2, .3);
    return this.rng.range(.4, .6);
  }

  getSegmentLength(pos, _prev, _attr) {
    if (pos.branchNum == 1) return this.rng.range(.2, .8);
    return this.rng.range(.5, 1.5);
  }

  getSegmentAngle(pos, prev, _attr) {
    return plantHelper.nextAngle(this.rng, pos, prev, 8, true);
  }

  getSegmentStyle(_n0, _n1) {
    return this.segmentStyle;
  }

  getLeaves(_n0, n1) {
    if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];
    const steps = {
      from: -75,
      to: 75,
      step: 10
    };
    const p = .5;

    const makeLeaf = angle => {
      const av = this.rng.range(-5, 5);
      const sv = this.rng.range(-.7, .7);
      return {
        angle: n1.attr.angle + angle + av,
        length: 3.5 + sv,
        handles: this.leafCurveHandles,
        style: this.leafStyle,
        xOffset: this.rng.range(-.2, .2),
        yOffset: this.rng.range(.8, .95)
      };
    };

    return plantHelper.repeat({
      rng: this.rng,
      steps,
      p,
      cb: makeLeaf
    });
  }

}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class ZamiaGenus extends BaseGenus {
  constructor(rngSeed) {
    super(rngSeed);
    this.width = 3.6;
    this.height = 3.5;
    this.maxBranchNum = 0;
    this.segmentStyle = {
      stroke: '#041',
      fill: '#161',
      'stroke-width': .0075
    };
    this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .01
    };
    this.leafCurveHandles = {
      bottomAngle: 24,
      bottomLength: .6,
      topAngle: 179,
      topLength: .2
    };
  }

  getRoots() {
    return plantHelper.repeat({
      rng: this.rng,
      n: [1, 3],
      cb: () => {
        return {
          n: this.rng.intRange(5, 7),
          attr: _objectSpread$1(_objectSpread$1({}, plantHelper.rootPosAngle(this.rng, .25, 15)), {}, {
            branchArchAngle: this.rng.ranges([-30, -5], [5, 30])
          })
        };
      }
    });
  }

  getOffshoots(_node) {
    return [];
  }

  getNodeWidth(_pos, prev, _attr) {
    if (!prev) return .1;
    return prev.attr.width * .8;
  }

  getSegmentLength(_pos, prev, _attr) {
    if (!prev) return this.rng.range(.4, 1);
    return prev.attr.length * this.rng.range(.6, .9);
  }

  getSegmentAngle(pos, prev, _attr) {
    return plantHelper.archingBranchAngle(this.rng, pos, prev, 5, .6);
  }

  getSegmentStyle() {
    return this.segmentStyle;
  }

  getLeaves(_n0, n1) {
    const length = n1.treeRoot.attr.length * 1.2 * (.5 + .5 * Math.sin(Math.PI * n1.pos.numFactor));
    const angles = n1.pos.isLast ? [-70, -30, 30, 70] : [-70, 70];
    return plantHelper.repeat({
      rng: this.rng,
      values: angles,
      p: .89,
      cb: angle => {
        const av = this.rng.range(-6, 6);
        const lv = this.rng.range(-.1, .1);
        const lf = Math.abs(angle) < 70 ? .9 : 1;
        return {
          angle: n1.attr.angle + angle + av,
          length: length * lf + lv,
          handles: this.leafCurveHandles,
          style: this.leafStyle,
          xOffset: 0,
          yOffset: 1
        };
      }
    });
  }

}

class PileaGenus extends BaseGenus {
  constructor(rngSeed) {
    super(rngSeed);

    defineProperty(this, "offshootSegmentStyle", void 0);

    defineProperty(this, "branchSegmentStyle", void 0);

    this.width = 4.6;
    this.height = 4.1;
    this.maxBranchNum = 1;
    this.segmentStyle = {
      stroke: '#931',
      fill: '#400',
      'stroke-width': .0075
    };
    this.offshootSegmentStyle = {
      stroke: '#931',
      fill: '#400',
      'stroke-width': .0075
    };
    this.branchSegmentStyle = {
      stroke: '#041',
      fill: '#161',
      'stroke-width': .0075
    };
    this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    this.leafCurveHandles = {
      bottomAngle: 80,
      bottomLength: 1,
      topAngle: 100,
      topLength: .2
    };
  }

  getRoots() {
    return [{
      n: this.rng.intRange(0, 3),
      attr: plantHelper.rootPosAngle(this.rng, .25, 8)
    }];
  }

  getOffshoots(node) {
    if (node.pos.isLast) return plantHelper.repeat({
      rng: this.rng,
      n: [1, 12],
      cb: () => {
        return {
          n: this.rng.intRange(3, 6),
          attr: {
            segmentAngle: node.attr.angle + this.rng.range(-40, 40),
            branchArchAngle: this.rng.ranges([-40, -5], [5, 40])
          }
        };
      }
    });
    if (node.pos.num) return plantHelper.repeat({
      rng: this.rng,
      n: [0, 4],
      cb: () => {
        return {
          n: this.rng.intRange(2, 3),
          attr: {
            segmentAngle: node.attr.angle + this.rng.ranges([-80, -40], [40, 80]),
            branchArchAngle: this.rng.ranges([-40, -5], [5, 40])
          }
        };
      }
    });
    return [];
  }

  getNodeWidth(pos, prev, _attr) {
    if (pos.branchNum == 0) return this.rng.range(.1, .3);
    if (pos.isOffshoot && prev !== null) return prev.attr.width;
    return this.rng.range(.05, .1);
  }

  getSegmentLength(pos, prev, _attr) {
    if (!prev) return this.rng.range(.6, 1.2);
    if (pos.branchNum == 0) return prev.attr.length * .9;
    if (pos.isOffshoot) return this.rng.range(.1, .2);

    if (pos.num == 1) {
      if (prev.branchRoot.pos.isLast) return this.rng.range(.6, 1.2);
      return this.rng.range(.3, .6);
    }

    return prev.attr.length * .75;
  }

  getSegmentAngle(pos, prev, _attr) {
    if (pos.branchNum == 0) return this.rng.range(-8, 8);
    return plantHelper.archingBranchAngle(this.rng, pos, prev, 5, .1);
  }

  getSegmentStyle(n0, _n1) {
    if (n0.pos.branchNum == 0) return this.segmentStyle;
    if (n0.pos.isOffshoot) return this.offshootSegmentStyle;
    return this.branchSegmentStyle;
  }

  getLeaves(n0, n1) {
    if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];
    const length = (n1.treeRoot.attr.length || 1) * this.rng.range(.4, 1.5);
    const angle = plantHelper.segmentAngle(n0) + this.rng.range(-8, 8);
    return [{
      angle,
      length,
      handles: this.leafCurveHandles,
      style: this.leafStyle,
      xOffset: 0,
      yOffset: .96
    }];
  }

}

const testPlantBodySize = (genus, n = 1000) => {
  const widths = [];
  const heights = [];

  for (let i = 0; i < n; i++) {
    const p = new SvgPlant(new genus()).body;
    p.genus.width = 0;
    p.genus.height = 0;
    p.init();
    widths.push(p.bbox.width);
    heights.push(p.bbox.height);
  }

  widths.sort((a, b) => a - b);
  heights.sort((a, b) => a - b);
  return (q = 50) => {
    const i = Math.max(0, Math.min(n - 1, Math.round(q / 100 * (n - 1))));
    return {
      width: widths[i],
      height: heights[i]
    };
  };
};

const findSeed = (genus, test, timeoutMs = 10 * 1000) => {
  let cancel = false,
      n = 0,
      seed;
  const t0 = Date.now();
  const to = setTimeout(() => {
    cancel = true;
  }, timeoutMs);

  while (true) {
    const p = new SvgPlant(new genus()).body;
    p.genus.width = 0;
    p.genus.height = 0;
    p.init();
    n++;

    if (test(p)) {
      clearTimeout(to);
      seed = p.genus.rngSeed;
      console.log('Seed found!', seed);
      break;
    }

    if (cancel) {
      console.log('No seed was found');
      break;
    }
  }

  const t = ((Date.now() - t0) / 1000).toFixed(2);
  console.log('findSeed finished after ' + t + ' seconds and ' + n + ' tries.');
  return seed;
};

const testPerformance = (genus, durationMs = 10 * 1000) => {
  const t0 = Date.now();
  let n = 0;

  while (true) {
    const p = new SvgPlant(new genus()).body;
    p.genus.width = 0;
    p.genus.height = 0;
    p.init();
    n++;
    if (Date.now() - t0 > durationMs) break;
  }

  const ms = Date.now() - t0;
  const s = ms / 1000;
  console.group(genus.name + ' Performance Test');
  console.log('created ' + n + ' plants in ' + s.toFixed(2) + ' seconds');
  console.log((n / s).toFixed(2) + ' plants/sec');
  console.log((ms / n).toFixed(2) + ' ms/plant');
  console.groupEnd();
  return;
};

var DevTools = /*#__PURE__*/Object.freeze({
  __proto__: null,
  testPlantBodySize: testPlantBodySize,
  findSeed: findSeed,
  testPerformance: testPerformance
});

const Genera = {
  'BushyPlant': BushyPlantGenus,
  'DragonTree': DragonTreeGenus,
  'Zamia': ZamiaGenus,
  'Pilea': PileaGenus
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
//# sourceMappingURL=svg-plant.cjs.js.map
