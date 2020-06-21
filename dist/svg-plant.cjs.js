'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var seedrandom = _interopDefault(require('seedrandom'));

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

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

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var html = {
  node: function node(tag, set) {
    var node = document.createElement(tag);
    html.attr(node, set);
    return node;
  },
  nodeNS: function nodeNS(tag, set, ns) {
    var node = document.createElementNS(ns, tag);
    html.attr(node, set);
    return node;
  },
  attr: function attr(node) {
    var set = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var name in set) {
      node.setAttribute(name, String(set[name]));
    }
  },
  svg: {
    root: function root(set) {
      var svg = html.svg.node('svg', set);
      svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
      return svg;
    },
    node: function node(tag, set) {
      var el = html.nodeNS(tag, {}, "http://www.w3.org/2000/svg");
      html.attr(el, set);
      return el;
    },
    compilePathDescription: function compilePathDescription(points) {
      var d = [];

      var _iterator = _createForOfIteratorHelper(points),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _p = _step.value;
          if (_p.length == 1) d.push(_p);else if (_p.length == 2) d.push(_p[0], _p[1]);else if (_p.length == 3) d.push(_p[0], _p[1], _p[2]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return d.join(' ');
    }
  }
};
var math = {
  toRadians: function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },
  fromAngle: function fromAngle(point, angle, length, precision) {
    var a = [Math.sin(math.toRadians(angle)) * length + point[0], -Math.cos(math.toRadians(angle)) * length + point[1]];

    if (precision) {
      a[0] = Math.round(a[0] * precision);
      a[1] = Math.round(a[1] * precision);
    }

    return a;
  },
  rectFromLine: function rectFromLine(pointBottom, pointTop, angleBottom, angleTop, widthBottom, widthTop, precision) {
    widthBottom /= 2;
    widthTop /= 2;
    return [math.fromAngle(pointBottom, angleBottom - 90, widthBottom, precision), math.fromAngle(pointTop, angleTop - 90, widthTop, precision), math.fromAngle(pointTop, angleTop + 90, widthTop, precision), math.fromAngle(pointBottom, angleBottom + 90, widthBottom, precision)];
  },
  pointOnLine: function pointOnLine(p1, p2, d) {
    return [p1[0] + d * (p2[0] - p1[0]), p1[1] + d * (p2[1] - p1[1])];
  },
  distance: function distance(p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
};
var plantHelper = {
  rootPosAngle: function rootPosAngle(rng, xMax, maxAngle) {
    var x = rng.range(-xMax, xMax);
    var f = Math.abs(x) / xMax;
    return {
      x: x,
      segmentAngle: maxAngle * f * (x < 0 ? -1 : 1)
    };
  },
  segmentAngle: function segmentAngle(baseNode) {
    if (baseNode.attr.segmentAngle !== undefined) return baseNode.attr.segmentAngle;
    return baseNode.attr.angle;
  },
  nextAngle: function nextAngle(rng, pos, prevNode, variance, alternate) {
    if (pos.isOffshoot) return prevNode.attr.angle;
    var pa = this.segmentAngle(prevNode);

    if (alternate) {
      var dir = pos.branchNum > 0 ? 1 : prevNode.treeRoot.attr.x >= 0 ? 1 : -1;
      return pa + (prevNode.pos.num % 2 ? 1 : -1) * rng.range(0, variance) * dir;
    } else {
      return pa + rng.range(-variance, variance);
    }
  },
  archingBranchAngle: function archingBranchAngle(rng, pos, prevNode, variance, numAdjust) {
    if (pos.isOffshoot) return prevNode.attr.angle;
    var pa = plantHelper.segmentAngle(prevNode);
    var base = prevNode.branchRoot.attr.branchArchAngle;
    var f = numAdjust ? 1 - numAdjust + numAdjust * (1 - pos.numFactor) : 1;
    return pa + f * base + rng.range(-variance, variance);
  },
  repeat: function repeat(_ref) {
    var rng = _ref.rng,
        cb = _ref.cb,
        _ref$p = _ref.p,
        p = _ref$p === void 0 ? 1 : _ref$p,
        _ref$shuffle = _ref.shuffle,
        shuffle = _ref$shuffle === void 0 ? true : _ref$shuffle,
        steps = _ref.steps,
        values = _ref.values,
        n = _ref.n;
    var a = [];
    if (p <= 0) return a;
    var test = p < 1;

    if (values !== undefined) {
      var _iterator2 = _createForOfIteratorHelper(values),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _v = _step2.value;

          if (!test || rng.test(p)) {
            a.push(cb(_v));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else if (steps !== undefined) {
      for (var _i = steps.from; _i <= steps.to; _i += steps.step) {
        if (!test || rng.test(p)) {
          a.push(cb(_i));
        }
      }
    } else if (n !== undefined) {
      if (Array.isArray(n)) n = rng.intRange(n[0], n[1]);

      for (var _i2 = 0; _i2 < n; _i2++) {
        if (!test || rng.test(p)) {
          a.push(cb(_i2));
        }
      }
    }

    if (shuffle) rng.shuffle(a);
    return a;
  }
};

var rng = function rng(seed) {
  var seedStr = seed === undefined ? (Math.random() + '').substring(2) : String(seed);
  var fn;
  var rng = {
    get seed() {
      return seedStr;
    },

    reset: function reset() {
      fn = seedrandom(seedStr);
    },
    random: function random() {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return fn() * v;
    },
    test: function test() {
      var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : .5;
      var pass = arguments.length > 1 ? arguments[1] : undefined;
      var fail = arguments.length > 2 ? arguments[2] : undefined;
      var r = p >= 1 ? true : p <= 0 ? false : fn() < p;
      if (r) return pass === undefined ? true : pass;
      return fail === undefined ? false : fail;
    },
    range: function range(v0, v1) {
      if (v0 == v1) return v0;
      return v0 + fn() * (v1 - v0);
    },
    intRange: function intRange(v0, v1) {
      if (v0 == v1) return v0;
      return v0 + Math.floor(fn() * (v1 - v0 + 1));
    },
    ranges: function ranges() {
      for (var _len = arguments.length, ranges = new Array(_len), _key = 0; _key < _len; _key++) {
        ranges[_key] = arguments[_key];
      }

      if (!ranges.length) return 0;
      var ep = 1 / ranges.length;
      ranges = toConsumableArray(ranges);
      var last = ranges.pop();

      var _iterator3 = _createForOfIteratorHelper(ranges),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var r = _step3.value;

          var _p2 = r[2] || ep;

          if (rng.test(_p2)) return rng.range(r[0], r[1]);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return last ? rng.range(last[0], last[1]) : 0;
    },
    shuffle: function shuffle(a) {
      for (var _i3 = a.length - 1; _i3 > 0; _i3--) {
        var j = Math.floor(fn() * (_i3 + 1));
        var tmp = a[_i3];
        a[_i3] = a[j];
        a[j] = tmp;
      }

      return a;
    }
  };
  rng.reset();
  return rng;
};

var BBox = /*#__PURE__*/function () {
  function BBox(data) {
    classCallCheck(this, BBox);

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

  createClass(BBox, [{
    key: "addX",
    value: function addX(v) {
      if (v < this.x0) this.x0 = v;
      if (v > this.x1) this.x1 = v;
      return this;
    }
  }, {
    key: "addY",
    value: function addY(v) {
      if (v < this.y0) this.y0 = v;
      if (v > this.y1) this.y1 = v;
      return this;
    }
  }, {
    key: "addPoint",
    value: function addPoint(x, y) {
      this.addX(x);
      this.addY(y);
      return this;
    }
  }, {
    key: "addBBox",
    value: function addBBox(bbox) {
      this.addX(bbox.x0);
      this.addX(bbox.x1);
      this.addY(bbox.y0);
      this.addY(bbox.y1);
      return this;
    }
  }, {
    key: "expand",
    value: function expand(v) {
      this.x0 -= v;
      this.x1 += v;
      this.y0 -= v;
      this.y1 += v;
      return this;
    }
  }, {
    key: "contains",
    value: function contains(bbox, strict) {
      if (strict) return this.x0 < bbox.x0 && this.x1 > bbox.x1 && this.y0 < bbox.y0 && this.y1 > bbox.y1;
      return this.x0 <= bbox.x0 && this.x1 >= bbox.x1 && this.y0 <= bbox.y0 && this.y1 >= bbox.y1;
    }
  }, {
    key: "containedBy",
    value: function containedBy(bbox, strict) {
      if (strict) return this.x0 > bbox.x0 && this.x1 < bbox.x1 && this.y0 > bbox.y0 && this.y1 < bbox.y1;
      return this.x0 >= bbox.x0 && this.x1 <= bbox.x1 && this.y0 >= bbox.y0 && this.y1 <= bbox.y1;
    }
  }, {
    key: "containsPoint",
    value: function containsPoint(x, y, strict) {
      if (strict) return !(x <= this.x0 || x >= this.x1 || y <= this.y0 || y >= this.y1);
      return !(x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1);
    }
  }, {
    key: "clone",
    value: function clone() {
      return new BBox(this.data);
    }
  }, {
    key: "withPrecision",
    value: function withPrecision(p) {
      return new BBox({
        x0: Math.round(this.x0 * p),
        x1: Math.round(this.x1 * p),
        y0: Math.round(this.y0 * p),
        y1: Math.round(this.y1 * p)
      });
    }
  }, {
    key: "width",
    get: function get() {
      return this.x1 - this.x0;
    }
  }, {
    key: "height",
    get: function get() {
      return this.y1 - this.y0;
    }
  }, {
    key: "aspectRatio",
    get: function get() {
      if (!this.height) return 0;
      return this.width / this.height;
    }
  }, {
    key: "data",
    get: function get() {
      return {
        x0: this.x0,
        x1: this.x1,
        y0: this.y0,
        y1: this.y1
      };
    }
  }, {
    key: "pointsArray",
    get: function get() {
      return [[this.x0, this.y0], [this.x1, this.y1]];
    }
  }, {
    key: "viewBox",
    get: function get() {
      return "".concat(this.x0, " ").concat(this.y0, " ").concat(this.width, " ").concat(this.height);
    }
  }]);

  return BBox;
}();

var ProcTree = /*#__PURE__*/function () {
  function ProcTree(maxBranchNum, getNode, getOffshoots) {
    classCallCheck(this, ProcTree);

    defineProperty(this, "maxBranchNum", void 0);

    defineProperty(this, "getNode", void 0);

    defineProperty(this, "getOffshoots", void 0);

    defineProperty(this, "roots", void 0);

    this.maxBranchNum = maxBranchNum;
    this.getNode = getNode;
    this.getOffshoots = getOffshoots;
    this.roots = [];
  }

  createClass(ProcTree, [{
    key: "grow",
    value: function grow() {
      var roots = this.getOffshoots(null);

      for (var _i4 in roots) {
        this.growBranch(null, Number(_i4), roots[_i4].n, roots[_i4].attr || {});
      }
    }
  }, {
    key: "growBranch",
    value: function growBranch(rootNode, offshootNum, segmentCount, attr) {
      var isTreeRoot = !rootNode;
      var node = this.addNode(rootNode, true, offshootNum, segmentCount, attr);
      if (isTreeRoot) this.roots.push(node);
      var isLastBranch = this.maxBranchNum == node.pos.branchNum;

      if (!isLastBranch && isTreeRoot) {
        var offshoots = this.getOffshoots(node);

        for (var _i5 in offshoots) {
          this.growBranch(node, Number(_i5), offshoots[_i5].n, offshoots[_i5].attr || {});
        }
      }

      for (var _i6 = 0; _i6 < segmentCount; _i6++) {
        node = this.addNode(node, false, offshootNum, segmentCount, {});

        if (!isLastBranch) {
          var _offshoots = this.getOffshoots(node);

          for (var _i7 in _offshoots) {
            this.growBranch(node, Number(_i7), _offshoots[_i7].n, _offshoots[_i7].attr || {});
          }
        }
      }
    }
  }, {
    key: "addNode",
    value: function addNode(prev, isOffshoot, offshootNum, maxNum, rootAttr) {
      var pos = this.getPos(prev ? prev.pos : null, isOffshoot, maxNum);
      var node = {
        pos: pos,
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
  }, {
    key: "getPos",
    value: function getPos(prev, isOffshoot, maxNum) {
      if (prev === null) return {
        num: 0,
        branchNum: 0,
        height: 0,
        offshootHeight: 0,
        isRoot: true,
        isLast: maxNum == 0,
        isLastBranch: this.maxBranchNum == 0,
        isOffshoot: isOffshoot,
        numFactor: 1,
        branchFactor: 1
      };
      var pos = {
        num: isOffshoot ? 0 : prev.num + 1,
        branchNum: isOffshoot ? prev.branchNum + 1 : prev.branchNum,
        height: isOffshoot ? prev.height : prev.height + 1,
        offshootHeight: isOffshoot ? prev.num : prev.offshootHeight,
        isRoot: false,
        isLast: false,
        isLastBranch: false,
        isOffshoot: isOffshoot,
        numFactor: 0,
        branchFactor: 0
      };
      if (pos.num == maxNum) pos.isLast = true;
      if (pos.branchNum == this.maxBranchNum) pos.isLastBranch = true;
      pos.numFactor = maxNum ? 1 - pos.num / maxNum : 1;
      pos.branchFactor = this.maxBranchNum ? 1 - pos.branchNum / this.maxBranchNum : 1;
      return pos;
    }
  }, {
    key: "eachSegment",
    value: function eachSegment(cb) {
      var _iterator4 = _createForOfIteratorHelper(this.roots),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _node = _step4.value;

          this._each(_node, cb);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "_each",
    value: function _each(node, cb) {
      // note: the treeRoot node can have offshoots
      // other nodes that are branchRoots cannot have offshoots
      while (node) {
        if (node.pos.num > 0 && node.prev) cb(node.prev, node);

        var _iterator5 = _createForOfIteratorHelper(node.offshoots),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var offshootNode = _step5.value;

            this._each(offshootNode.next, cb);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        node = node.next;
      }
    }
  }]);

  return ProcTree;
}();

function plantPotSvg(pathAttr) {
  var baseCfg = {
    rimHeight: 20,
    rimLipOuter: 2,
    rimLipInner: 4,
    bottom: 15
  };
  var sw = pathAttr ? 'stroke-width' in pathAttr ? pathAttr['stroke-width'] : 2 : false;
  if (sw) pathAttr['stroke-width'] = sw;
  var pad = sw && typeof sw == 'number' ? sw / 2 : 0;

  var getPoints = function getPoints(cfg) {
    return [['M', pad, pad], ['L', 100 - pad, pad], ['L', 100 - pad - cfg.rimLipOuter, cfg.rimHeight], ['L', 100 - pad - cfg.rimLipInner, cfg.rimHeight], ['L', 100 - pad - cfg.bottom, 100 - pad], ['L', pad + cfg.bottom, 100 - pad], ['L', pad + cfg.rimLipInner, cfg.rimHeight], ['L', pad + cfg.rimLipOuter, cfg.rimHeight], 'Z'];
  };

  if (!pathAttr) pathAttr = {};
  pathAttr.d = html.svg.compilePathDescription(getPoints(baseCfg));
  var path = html.svg.node('path', pathAttr);
  var svg = html.svg.root({
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

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var precision = 10000;

function prc(v) {
  if (Array.isArray(v)) return [Math.round(v[0] * precision), Math.round(v[1] * precision)];
  return Math.round(v * precision);
}

var BranchSegment = /*#__PURE__*/function () {
  function BranchSegment(base, style, n0, n1) {
    classCallCheck(this, BranchSegment);

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

  createClass(BranchSegment, [{
    key: "getPoints",
    value: function getPoints(age) {
      var ageFactor = this.getAgeFactor(age);
      if (!ageFactor) return;
      var top = this.top;

      if (ageFactor < 1) {
        top = math.fromAngle(this.base, this.angle, this.length * ageFactor);
      }

      var r = math.rectFromLine(this.base, top, this.bottomAngle, this.topAngle, this.bottomWidth, this.topWidth, precision);
      return ['M', r[0], 'L', r[1], 'L', r[2], 'L', r[3], 'Z'];
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox() {
      var points = math.rectFromLine(this.base, this.top, this.bottomAngle, this.topAngle, this.bottomWidth, this.topWidth, undefined);
      var bb = new BBox();
      bb.addPoint(points[0][0], points[0][1]);
      bb.addPoint(points[1][0], points[1][1]);
      bb.addPoint(points[2][0], points[2][1]);
      bb.addPoint(points[3][0], points[3][1]);
      return bb;
    }
  }, {
    key: "getAgeFactor",
    value: function getAgeFactor(age) {
      if (age <= this.ageOffset) return 0;
      if (age >= this.ageOffset + this.length) return 1;
      return (age - this.ageOffset) / this.length;
    }
  }, {
    key: "getOffsetPoint",
    value: function getOffsetPoint(x, y) {
      if (!x) {
        if (!y) return this.base;
        if (y == 1) return this.top;
        return math.fromAngle(this.base, this.angle, this.length * y);
      }

      var dir = this.angle < 0 ? 1 : -1;

      if (!y) {
        return math.fromAngle(this.base, this.bottomAngle + 90 * dir, this.bottomWidth / 2 * x);
      }

      if (y == 1) {
        return math.fromAngle(this.top, this.topAngle + 90 * dir, this.topWidth / 2 * x);
      }

      var l1 = [math.fromAngle(this.base, this.bottomAngle + 90 * dir, this.bottomWidth / 2), math.fromAngle(this.top, this.topAngle + 90 * dir, this.topWidth / 2)];
      var l2 = [math.fromAngle(this.base, this.bottomAngle + 90 * dir, -this.bottomWidth / 2), math.fromAngle(this.top, this.topAngle + 90 * dir, -this.topWidth / 2)];
      var l3 = [math.pointOnLine(l1[0], l1[1], y), math.pointOnLine(l2[0], l2[1], y)];
      x = 1 - (x / 2 + .5);
      return math.pointOnLine(l3[0], l3[1], x);
    }
  }]);

  return BranchSegment;
}();

var Leaf = /*#__PURE__*/function () {
  function Leaf(segment, _ref) {
    var angle = _ref.angle,
        length = _ref.length,
        handles = _ref.handles,
        style = _ref.style,
        xOffset = _ref.xOffset,
        yOffset = _ref.yOffset;

    classCallCheck(this, Leaf);

    defineProperty(this, "base", void 0);

    defineProperty(this, "pBase", void 0);

    defineProperty(this, "top", void 0);

    defineProperty(this, "angle", void 0);

    defineProperty(this, "length", void 0);

    defineProperty(this, "handles", void 0);

    defineProperty(this, "ageOffset", void 0);

    defineProperty(this, "style", void 0);

    defineProperty(this, "bbox", void 0);

    var base = segment.getOffsetPoint(xOffset, yOffset);
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

  createClass(Leaf, [{
    key: "getPoints",
    value: function getPoints(age) {
      var ageFactor = this.getAgeFactor(age);
      if (!ageFactor) return;
      var top = this.top;

      if (ageFactor < 1) {
        top = math.fromAngle(this.base, this.angle, this.length * ageFactor);
      }

      var curves = this.getCurves({
        top: top,
        ageFactor: ageFactor,
        precision: precision
      });
      top = prc(top);
      return ['M', this.pBase, 'C', curves.up[0], curves.up[1], top, 'C', curves.down[0], curves.down[1], this.pBase];
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox() {
      var c = this.getCurves({
        top: this.top,
        ageFactor: 1
      });
      var bb = new BBox(bezierCurveBoundingBox(this.base[0], this.base[1], c.up[0][0], c.up[0][1], c.up[1][0], c.up[1][1], this.top[0], this.top[1]));
      bb.addBBox(bezierCurveBoundingBox(this.top[0], this.top[1], c.down[0][0], c.down[0][1], c.down[1][0], c.down[1][1], this.base[0], this.base[1]));
      if (typeof this.style['stroke-width'] == 'number') bb.expand(this.style['stroke-width'] / 2);
      return bb;
    }
  }, {
    key: "getCurves",
    value: function getCurves(_ref2) {
      var top = _ref2.top,
          ageFactor = _ref2.ageFactor,
          precision = _ref2.precision;
      var bha = this.handles.bottomAngle;
      var bhl = this.handles.bottomLength * ageFactor;
      var tha = this.handles.topAngle;
      var thl = this.handles.topLength * ageFactor;
      return {
        up: [math.fromAngle(this.base, this.angle + bha, this.length * bhl, precision), math.fromAngle(top, this.angle + tha, this.length * thl, precision)],
        down: [math.fromAngle(top, this.angle - tha, this.length * thl, precision), math.fromAngle(this.base, this.angle - bha, this.length * bhl, precision)]
      };
    }
  }, {
    key: "getAgeFactor",
    value: function getAgeFactor(age) {
      if (age <= this.ageOffset) return 0;
      if (age >= this.ageOffset + this.length) return 1;
      return (age - this.ageOffset) / this.length;
    }
  }]);

  return Leaf;
}();

var Branches = /*#__PURE__*/function () {
  function Branches() {
    classCallCheck(this, Branches);

    defineProperty(this, "segments", void 0);

    defineProperty(this, "leaves", void 0);

    this.segments = [];
    this.leaves = [];
  }

  createClass(Branches, [{
    key: "addSegment",
    value: function addSegment(branchNum, segment) {
      var branch = this.segments[branchNum];

      if (!branch) {
        branch = [];
        this.segments[branchNum] = branch;
      }

      branch.push(segment);
    }
  }, {
    key: "addLeaf",
    value: function addLeaf(branchNum, leaf) {
      var branch = this.leaves[branchNum];

      if (!branch) {
        branch = [];
        this.leaves[branchNum] = branch;
      }

      branch.push(leaf);
    }
  }, {
    key: "getArray",
    value: function getArray() {
      var ret = [];

      for (var i = 0; i < this.segments.length; i++) {
        ret = ret.concat(this.segments[i] || []);
        ret = ret.concat(this.sortLeaves(this.leaves[i]));
      }

      return ret;
    }
  }, {
    key: "sortLeaves",
    value: function sortLeaves(a) {
      if (!a) return [];
      return a.sort(function (l0, l1) {
        if (l1.bbox.containsPoint(l0.base[0], l0.base[1], true)) {
          return -1;
        }

        if (l0.bbox.containsPoint(l1.base[0], l1.base[1], true)) {
          return 1;
        }

        var d0 = math.distance(l0.base, [0, 0]);
        var d1 = math.distance(l1.base, [0, 0]);
        return d1 - d0;
      });
    }
  }]);

  return Branches;
}();

var PlantBody = /*#__PURE__*/function () {
  function PlantBody(genus) {
    classCallCheck(this, PlantBody);

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

  createClass(PlantBody, [{
    key: "getTree",
    value: function getTree() {
      var _this = this;

      var getNodeAttr = function getNodeAttr(pos, prev, attr) {
        return {
          width: _this.genus.getNodeWidth(pos, prev, attr),
          angle: prev ? _this.genus.getSegmentAngle(pos, prev, attr) : 0,
          length: pos.isLast ? prev ? prev.attr.length : 0 : _this.genus.getSegmentLength(pos, prev, attr),
          totalLength: prev ? (pos.isOffshoot ? 0 : prev.attr.length) + prev.attr.totalLength : 0
        };
      };

      var getOffshoots = function getOffshoots(node) {
        if (node === null) return _this.genus.getRoots();
        return _this.genus.getOffshoots(node);
      };

      return new ProcTree(this.genus.maxBranchNum, getNodeAttr, getOffshoots);
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.genus.reset();
      var tree = this.getTree();
      tree.grow();
      this.bbox = new BBox({
        x0: -this.genus.width / 2,
        x1: this.genus.width / 2,
        y0: -this.genus.height,
        y1: 0
      });
      var branches = new Branches();
      var points = new Map();
      var maxAge = 0;

      var getBasePoint = function getBasePoint(node) {
        if (!node.prev) {
          var p = [node.attr.x || 0, 0];

          _this2.bbox.addPoint(p[0], p[1]);

          return p;
        } else if (node.pos.isOffshoot) {
          var _p = points.get(node.prev);

          if (_p) return _p;
          var rp = [node.prev.attr.x || 0, 0];
          points.set(node.prev, rp);

          _this2.bbox.addPoint(rp[0], rp[1]);

          return rp;
        }

        return points.get(node);
      };

      tree.eachSegment(function (n0, n1) {
        var base = getBasePoint(n0);

        var style = _this2.genus.getSegmentStyle(n0, n1);

        var s = new BranchSegment(base, style, n0, n1);
        points.set(n1, s.top);

        _this2.bbox.addBBox(s.bbox);

        branches.addSegment(n0.pos.branchNum, s);

        _this2.genus.getLeaves(n0, n1).map(function (cfg) {
          var leaf = new Leaf(s, cfg);

          _this2.bbox.addBBox(leaf.bbox);

          branches.addLeaf(n0.pos.branchNum, leaf);
          if (leaf.ageOffset + leaf.length > maxAge) maxAge = leaf.ageOffset + leaf.length;
        });

        if (n1.attr.totalLength > maxAge) maxAge = n1.attr.totalLength;
      });
      this.parts = branches.getArray();
      this.maxAge = maxAge; // make sure the plant is centered

      var bboxX = Math.max(Math.abs(this.bbox.x0), Math.abs(this.bbox.x1));
      this.bbox.x0 = -bboxX;
      this.bbox.x1 = bboxX;
      this.yFactor = this.bbox.height / -this.bbox.y0 || 1;
    }
  }, {
    key: "render",
    value: function render(age) {
      var colors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var svg = arguments.length > 2 ? arguments[2] : undefined;
      age *= this.maxAge;

      if (this.parts) {
        var _iterator = _createForOfIteratorHelper$1(this.parts),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var p = _step.value;
            var points = p.getPoints(age);
            if (!points) continue;
            var style = {},
                add = {};

            if (colors) {
              style = p.style;
              add = {};
              if (typeof style['stroke-width'] == 'number') add['stroke-width'] = prc(style['stroke-width']);
            }

            var set = Object.assign({}, style, add, {
              d: html.svg.compilePathDescription(points)
            });
            svg.appendChild(html.svg.node('path', set));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "getSvg",
    value: function getSvg(age, colors) {
      if (this.parts === undefined) this.init();
      var svg = html.svg.root({
        class: 'svg-plant-body',
        viewBox: this.bbox.withPrecision(precision).viewBox,
        preserveAspectRatio: 'xMidYMax meet'
      });
      this.render(age, colors, svg);
      return svg;
    }
  }]);

  return PlantBody;
}();

var SvgPlant = /*#__PURE__*/function () {
  function SvgPlant(genus, cfg) {
    classCallCheck(this, SvgPlant);

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

    if (_typeof_1(cfg) == 'object') {
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

  createClass(SvgPlant, [{
    key: "update",
    value: function update() {
      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var pot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (body) this._bodySvgElement = null;
      if (pot) this._potSvgElement = null;
      this.updateSvgElement();
    }
  }, {
    key: "updateSvgElement",
    value: function updateSvgElement() {
      var svg = this._svgElement;
      if (!svg) return;
      svg.innerHTML = this.getSvgElement().innerHTML;
    }
  }, {
    key: "getSvgElement",
    value: function getSvgElement() {
      var svg = html.svg.root({
        class: 'svg-plant',
        viewBox: '0 0 1 1',
        preserveAspectRatio: 'xMidYMax meet'
      });

      var place = function place(el, x, y, w, h) {
        el.setAttribute('x', String(x));
        el.setAttribute('y', String(y));
        el.setAttribute('width', String(w));
        el.setAttribute('height', String(h));
      };

      var pot = this.potSvgElement;
      var body = this.bodySvgElement;

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

        var overlap = this.cfg.color ? 0 : .001;
        var height;
        var bodyHeight = 1 - this.cfg.potSize;

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
  }, {
    key: "getPotSvgElement",
    value: function getPotSvgElement() {
      if (!this.cfg.color) return plantPotSvg({});
      return plantPotSvg(this.cfg.potPathAttr);
    }
  }, {
    key: "getBodySvgElement",
    value: function getBodySvgElement() {
      return this.body.getSvg(this.cfg.age, this.cfg.color);
    }
  }, {
    key: "animate",
    value: function animate() {
      var fromAge = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var toAge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var durationMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
      this.cancelAnimation();
      this.animation = {
        fromAge: fromAge,
        toAge: toAge,
        ageSpan: toAge - fromAge,
        currentAge: fromAge,
        durationMs: durationMs,
        nextAnimationFrame: undefined,
        paused: true
      };
      this.resumeAnimation();
    }
  }, {
    key: "pauseAnimation",
    value: function pauseAnimation() {
      if (this.animation) {
        if (this.animation.nextAnimationFrame !== undefined) {
          cancelAnimationFrame(this.animation.nextAnimationFrame);
        }

        this.animation.paused = true;
      }
    }
  }, {
    key: "cancelAnimation",
    value: function cancelAnimation() {
      this.pauseAnimation();
      this.animation = null;
    }
  }, {
    key: "resumeAnimation",
    value: function resumeAnimation() {
      var _this = this;

      var a = this.animation;
      if (!a || !a.paused) return;
      a.paused = false;
      this.age = a.currentAge;

      var acl = function acl(t) {
        return t < 0 ? 0 : t > 1 ? 1 : Math.sin((t - .5) * Math.PI) * .5 + .5;
      };

      var aclInv = function aclInv(t) {
        return t < 0 ? 0 : t > 1 ? 1 : Math.asin(t * 2 - 1) / Math.PI + .5;
      };

      var t0;

      var upd = function upd(ts) {
        if (!t0) {
          var f = (a.currentAge - a.fromAge) / a.ageSpan;
          t0 = ts - aclInv(f) * a.durationMs;
          a.nextAnimationFrame = requestAnimationFrame(upd);
        } else {
          var _f = acl(Math.min(1, (ts - t0) / a.durationMs));

          if (_f < 1) {
            _this.cfg.age = a.fromAge + _f * a.ageSpan;
            a.currentAge = _this.cfg.age;
            _this._bodySvgElement = null;

            _this.updateSvgElement();

            a.nextAnimationFrame = requestAnimationFrame(upd);
          } else {
            _this.age = a.toAge;
            _this.animation = null;
          }
        }
      };

      a.nextAnimationFrame = requestAnimationFrame(upd);
    }
  }, {
    key: "seed",
    get: function get() {
      return this.body.genus.rngSeed;
    }
  }, {
    key: "color",
    get: function get() {
      return this.cfg.color;
    },
    set: function set(v) {
      v = !!v;

      if (v != this.cfg.color) {
        this.cfg.color = v;
        this.update();
      }
    }
  }, {
    key: "age",
    get: function get() {
      return this.cfg.age;
    },
    set: function set(v) {
      v = Math.max(0, Math.min(v, 1));

      if (v != this.cfg.age) {
        this.cfg.age = v;
        this.update(true, false);
      }
    }
  }, {
    key: "potSize",
    get: function get() {
      return this.cfg.potSize;
    },
    set: function set(v) {
      v = Math.max(0, Math.min(v, 1));

      if (v != this.cfg.potSize) {
        this.cfg.potSize = v;
        this.update(false, true);
      }
    }
  }, {
    key: "potPathAttr",
    get: function get() {
      return this.cfg.potPathAttr;
    },
    set: function set(v) {
      if (v !== this.cfg.potPathAttr) {
        this.cfg.potPathAttr = v;
        this.update(false, true);
      }
    }
  }, {
    key: "svgElement",
    get: function get() {
      if (!this._svgElement) {
        this._svgElement = this.getSvgElement();
      }

      return this._svgElement;
    }
  }, {
    key: "potSvgElement",
    get: function get() {
      if (this.cfg.potSize == 0) return null;

      if (!this._potSvgElement) {
        this._potSvgElement = this.getPotSvgElement();
      }

      return this._potSvgElement;
    }
  }, {
    key: "bodySvgElement",
    get: function get() {
      if (this.cfg.potSize == 1) return null;

      if (!this._bodySvgElement) {
        this._bodySvgElement = this.getBodySvgElement();
      }

      return this._bodySvgElement;
    }
  }]);

  return SvgPlant;
}();

var BaseGenus = /*#__PURE__*/function () {
  function BaseGenus(rngSeed) {
    classCallCheck(this, BaseGenus);

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

  createClass(BaseGenus, [{
    key: "reset",
    value: function reset() {
      this.rng.reset();
    }
  }, {
    key: "getRoots",
    value: function getRoots() {
      return [{
        n: 3,
        attr: {
          x: 0,
          segmentAngle: 0
        }
      }];
    }
  }, {
    key: "getOffshoots",
    value: function getOffshoots(node) {
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
  }, {
    key: "getNodeWidth",
    value: function getNodeWidth(_pos, _prev, _attr) {
      return .1;
    }
  }, {
    key: "getSegmentLength",
    value: function getSegmentLength(_pos, _prev, _attr) {
      return 1;
    }
  }, {
    key: "getSegmentAngle",
    value: function getSegmentAngle(pos, prev, _attr) {
      if (pos.isOffshoot) return prev.attr.angle;
      return prev.attr.segmentAngle !== undefined ? prev.attr.segmentAngle : prev.attr.angle;
    }
  }, {
    key: "getSegmentStyle",
    value: function getSegmentStyle(_n0, _n1) {
      return this.segmentStyle;
    }
  }, {
    key: "getLeaves",
    value: function getLeaves(_n0, n1) {
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
  }, {
    key: "genusName",
    get: function get() {
      var cn = this.constructor.name;
      return cn.substring(0, cn.length - 5);
    }
  }, {
    key: "rngSeed",
    get: function get() {
      return this.rng.seed;
    }
  }], [{
    key: "genusName",
    get: function get() {
      var cn = this.name;
      return cn.substring(0, cn.length - 5);
    }
  }]);

  return BaseGenus;
}();

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var BushyPlantGenus = /*#__PURE__*/function (_BaseGenus) {
  inherits(BushyPlantGenus, _BaseGenus);

  var _super = _createSuper(BushyPlantGenus);

  function BushyPlantGenus(rngSeed) {
    var _this;

    classCallCheck(this, BushyPlantGenus);

    _this = _super.call(this, rngSeed);
    _this.width = 6.1;
    _this.height = 6.6;
    _this.maxBranchNum = 3;
    _this.segmentStyle = {
      fill: '#400',
      stroke: '#931',
      'stroke-width': .0075
    };
    _this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    _this.leafCurveHandles = {
      bottomAngle: 60,
      bottomLength: .6,
      topAngle: 179,
      topLength: .2
    };
    return _this;
  }

  createClass(BushyPlantGenus, [{
    key: "getRoots",
    value: function getRoots() {
      return [{
        n: this.rng.intRange(4, 6),
        attr: plantHelper.rootPosAngle(this.rng, .5, 6)
      }];
    }
  }, {
    key: "getOffshoots",
    value: function getOffshoots(node) {
      var _this2 = this;

      if (node.pos.isLast || node.pos.num == 0) return [];
      var p = .5 * (.5 + .5 * node.pos.numFactor) * (.5 + .5 * node.pos.branchFactor);
      var a = [];

      var getNodeCount = function getNodeCount() {
        return 4 - node.pos.branchNum - _this2.rng.test(.6, 1, 0);
      };

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
  }, {
    key: "getNodeWidth",
    value: function getNodeWidth(pos, prev, _attr) {
      if (pos.isOffshoot && prev) return prev.attr.width;
      return .1 * (.1 + .9 * pos.branchFactor);
    }
  }, {
    key: "getSegmentLength",
    value: function getSegmentLength(pos, prev, _attr) {
      if (!prev) return 1;
      if (!pos.isOffshoot && pos.branchNum > 0) return prev.attr.length * .75;
      if (!pos.isOffshoot) return prev.attr.length;
      var f = .2 + .8 * (prev.branchRoot.prev ? prev.branchRoot.prev.pos.numFactor : 1);
      return prev.attr.length * f;
    }
  }, {
    key: "getSegmentAngle",
    value: function getSegmentAngle(pos, prev, _attr) {
      if (pos.branchNum > 0) return plantHelper.nextAngle(this.rng, pos, prev, 16, true);
      return plantHelper.nextAngle(this.rng, pos, prev, 8, true);
    }
  }, {
    key: "getSegmentStyle",
    value: function getSegmentStyle(_n0, _n1) {
      return this.segmentStyle;
    }
  }, {
    key: "getLeaves",
    value: function getLeaves(_n0, n1) {
      var _this3 = this;

      if (n1.pos.branchNum == 0 && n1.pos.num < 2) return [];
      var leaves = [];

      var addLeaf = function addLeaf(avf) {
        leaves.push({
          angle: n1.attr.angle + (avf ? avf * _this3.rng.range(20, 40) : _this3.rng.range(-10, 10)),
          length: _this3.rng.range(.5, .75),
          handles: _this3.leafCurveHandles,
          style: _this3.leafStyle,
          xOffset: avf ? -avf * _this3.rng.range(0, .5) : 0,
          yOffset: avf ? _this3.rng.range(.3, .7) : .95
        });
      };

      if (n1.pos.isLast && this.rng.test(.5)) addLeaf(0);
      if (this.rng.test(.5)) addLeaf(1);
      if (this.rng.test(.5)) addLeaf(-1);
      return leaves;
    }
  }]);

  return BushyPlantGenus;
}(BaseGenus);

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var DragonTreeGenus = /*#__PURE__*/function (_BaseGenus) {
  inherits(DragonTreeGenus, _BaseGenus);

  var _super = _createSuper$1(DragonTreeGenus);

  function DragonTreeGenus(rngSeed) {
    var _this;

    classCallCheck(this, DragonTreeGenus);

    _this = _super.call(this, rngSeed);
    _this.width = 10.3;
    _this.height = 8.6;
    _this.maxBranchNum = 1;
    _this.segmentStyle = {
      fill: '#400',
      stroke: '#931',
      'stroke-width': .0075
    };
    _this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    _this.leafCurveHandles = {
      bottomAngle: 30,
      bottomLength: .2,
      topAngle: 179,
      topLength: .2
    };
    return _this;
  }

  createClass(DragonTreeGenus, [{
    key: "getRoots",
    value: function getRoots() {
      return [{
        n: this.rng.intRange(2, 4),
        attr: plantHelper.rootPosAngle(this.rng, .5, 6)
      }];
    }
  }, {
    key: "getOffshoots",
    value: function getOffshoots(node) {
      var _this2 = this;

      if (!node.pos.isLast) return [];
      var p = .75;
      var steps = {
        from: -60,
        to: 60,
        step: 30
      };

      var makeOffshoot = function makeOffshoot(angle) {
        return {
          n: 2,
          attr: {
            segmentAngle: node.attr.angle + angle + _this2.rng.range(-10, 10)
          }
        };
      };

      var offshoots = plantHelper.repeat({
        rng: this.rng,
        steps: steps,
        p: p,
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
  }, {
    key: "getNodeWidth",
    value: function getNodeWidth(pos, prev, _attr) {
      if (pos.isOffshoot && prev) return prev.attr.width;
      if (pos.branchNum == 1) return this.rng.range(.2, .3);
      return this.rng.range(.4, .6);
    }
  }, {
    key: "getSegmentLength",
    value: function getSegmentLength(pos, _prev, _attr) {
      if (pos.branchNum == 1) return this.rng.range(.2, .8);
      return this.rng.range(.5, 1.5);
    }
  }, {
    key: "getSegmentAngle",
    value: function getSegmentAngle(pos, prev, _attr) {
      return plantHelper.nextAngle(this.rng, pos, prev, 8, true);
    }
  }, {
    key: "getSegmentStyle",
    value: function getSegmentStyle(_n0, _n1) {
      return this.segmentStyle;
    }
  }, {
    key: "getLeaves",
    value: function getLeaves(_n0, n1) {
      var _this3 = this;

      if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];
      var steps = {
        from: -75,
        to: 75,
        step: 10
      };
      var p = .5;

      var makeLeaf = function makeLeaf(angle) {
        var av = _this3.rng.range(-5, 5);

        var sv = _this3.rng.range(-.7, .7);

        return {
          angle: n1.attr.angle + angle + av,
          length: 3.5 + sv,
          handles: _this3.leafCurveHandles,
          style: _this3.leafStyle,
          xOffset: _this3.rng.range(-.2, .2),
          yOffset: _this3.rng.range(.8, .95)
        };
      };

      return plantHelper.repeat({
        rng: this.rng,
        steps: steps,
        p: p,
        cb: makeLeaf
      });
    }
  }]);

  return DragonTreeGenus;
}(BaseGenus);

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ZamiaGenus = /*#__PURE__*/function (_BaseGenus) {
  inherits(ZamiaGenus, _BaseGenus);

  var _super = _createSuper$2(ZamiaGenus);

  function ZamiaGenus(rngSeed) {
    var _this;

    classCallCheck(this, ZamiaGenus);

    _this = _super.call(this, rngSeed);
    _this.width = 3.6;
    _this.height = 3.5;
    _this.maxBranchNum = 0;
    _this.segmentStyle = {
      stroke: '#041',
      fill: '#161',
      'stroke-width': .0075
    };
    _this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .01
    };
    _this.leafCurveHandles = {
      bottomAngle: 24,
      bottomLength: .6,
      topAngle: 179,
      topLength: .2
    };
    return _this;
  }

  createClass(ZamiaGenus, [{
    key: "getRoots",
    value: function getRoots() {
      var _this2 = this;

      return plantHelper.repeat({
        rng: this.rng,
        n: [1, 3],
        cb: function cb() {
          return {
            n: _this2.rng.intRange(5, 7),
            attr: _objectSpread$1(_objectSpread$1({}, plantHelper.rootPosAngle(_this2.rng, .25, 15)), {}, {
              branchArchAngle: _this2.rng.ranges([-30, -5], [5, 30])
            })
          };
        }
      });
    }
  }, {
    key: "getOffshoots",
    value: function getOffshoots(_node) {
      return [];
    }
  }, {
    key: "getNodeWidth",
    value: function getNodeWidth(_pos, prev, _attr) {
      if (!prev) return .1;
      return prev.attr.width * .8;
    }
  }, {
    key: "getSegmentLength",
    value: function getSegmentLength(_pos, prev, _attr) {
      if (!prev) return this.rng.range(.4, 1);
      return prev.attr.length * this.rng.range(.6, .9);
    }
  }, {
    key: "getSegmentAngle",
    value: function getSegmentAngle(pos, prev, _attr) {
      return plantHelper.archingBranchAngle(this.rng, pos, prev, 5, .6);
    }
  }, {
    key: "getSegmentStyle",
    value: function getSegmentStyle() {
      return this.segmentStyle;
    }
  }, {
    key: "getLeaves",
    value: function getLeaves(_n0, n1) {
      var _this3 = this;

      var length = n1.treeRoot.attr.length * 1.2 * (.5 + .5 * Math.sin(Math.PI * n1.pos.numFactor));
      var angles = n1.pos.isLast ? [-70, -30, 30, 70] : [-70, 70];
      return plantHelper.repeat({
        rng: this.rng,
        values: angles,
        p: .89,
        cb: function cb(angle) {
          var av = _this3.rng.range(-6, 6);

          var lv = _this3.rng.range(-.1, .1);

          var lf = Math.abs(angle) < 70 ? .9 : 1;
          return {
            angle: n1.attr.angle + angle + av,
            length: length * lf + lv,
            handles: _this3.leafCurveHandles,
            style: _this3.leafStyle,
            xOffset: 0,
            yOffset: 1
          };
        }
      });
    }
  }]);

  return ZamiaGenus;
}(BaseGenus);

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var PileaGenus = /*#__PURE__*/function (_BaseGenus) {
  inherits(PileaGenus, _BaseGenus);

  var _super = _createSuper$3(PileaGenus);

  function PileaGenus(rngSeed) {
    var _this;

    classCallCheck(this, PileaGenus);

    _this = _super.call(this, rngSeed);

    defineProperty(assertThisInitialized(_this), "offshootSegmentStyle", void 0);

    defineProperty(assertThisInitialized(_this), "branchSegmentStyle", void 0);

    _this.width = 4.6;
    _this.height = 4.1;
    _this.maxBranchNum = 1;
    _this.segmentStyle = {
      stroke: '#931',
      fill: '#400',
      'stroke-width': .0075
    };
    _this.offshootSegmentStyle = {
      stroke: '#931',
      fill: '#400',
      'stroke-width': .0075
    };
    _this.branchSegmentStyle = {
      stroke: '#041',
      fill: '#161',
      'stroke-width': .0075
    };
    _this.leafStyle = {
      stroke: '#0d5',
      fill: 'rgba(0,255,110,.9)',
      'stroke-width': .02
    };
    _this.leafCurveHandles = {
      bottomAngle: 80,
      bottomLength: 1,
      topAngle: 100,
      topLength: .2
    };
    return _this;
  }

  createClass(PileaGenus, [{
    key: "getRoots",
    value: function getRoots() {
      return [{
        n: this.rng.intRange(0, 3),
        attr: plantHelper.rootPosAngle(this.rng, .25, 8)
      }];
    }
  }, {
    key: "getOffshoots",
    value: function getOffshoots(node) {
      var _this2 = this;

      if (node.pos.isLast) return plantHelper.repeat({
        rng: this.rng,
        n: [1, 12],
        cb: function cb() {
          return {
            n: _this2.rng.intRange(3, 6),
            attr: {
              segmentAngle: node.attr.angle + _this2.rng.range(-40, 40),
              branchArchAngle: _this2.rng.ranges([-40, -5], [5, 40])
            }
          };
        }
      });
      if (node.pos.num) return plantHelper.repeat({
        rng: this.rng,
        n: [0, 4],
        cb: function cb() {
          return {
            n: _this2.rng.intRange(2, 3),
            attr: {
              segmentAngle: node.attr.angle + _this2.rng.ranges([-80, -40], [40, 80]),
              branchArchAngle: _this2.rng.ranges([-40, -5], [5, 40])
            }
          };
        }
      });
      return [];
    }
  }, {
    key: "getNodeWidth",
    value: function getNodeWidth(pos, prev, _attr) {
      if (pos.branchNum == 0) return this.rng.range(.1, .3);
      if (pos.isOffshoot && prev !== null) return prev.attr.width;
      return this.rng.range(.05, .1);
    }
  }, {
    key: "getSegmentLength",
    value: function getSegmentLength(pos, prev, _attr) {
      if (!prev) return this.rng.range(.6, 1.2);
      if (pos.branchNum == 0) return prev.attr.length * .9;
      if (pos.isOffshoot) return this.rng.range(.1, .2);

      if (pos.num == 1) {
        if (prev.branchRoot.pos.isLast) return this.rng.range(.6, 1.2);
        return this.rng.range(.3, .6);
      }

      return prev.attr.length * .75;
    }
  }, {
    key: "getSegmentAngle",
    value: function getSegmentAngle(pos, prev, _attr) {
      if (pos.branchNum == 0) return this.rng.range(-8, 8);
      return plantHelper.archingBranchAngle(this.rng, pos, prev, 5, .1);
    }
  }, {
    key: "getSegmentStyle",
    value: function getSegmentStyle(n0, _n1) {
      if (n0.pos.branchNum == 0) return this.segmentStyle;
      if (n0.pos.isOffshoot) return this.offshootSegmentStyle;
      return this.branchSegmentStyle;
    }
  }, {
    key: "getLeaves",
    value: function getLeaves(n0, n1) {
      if (!n1.pos.isLast || n1.pos.branchNum != 1) return [];
      var length = (n1.treeRoot.attr.length || 1) * this.rng.range(.4, 1.5);
      var angle = plantHelper.segmentAngle(n0) + this.rng.range(-8, 8);
      return [{
        angle: angle,
        length: length,
        handles: this.leafCurveHandles,
        style: this.leafStyle,
        xOffset: 0,
        yOffset: .96
      }];
    }
  }]);

  return PileaGenus;
}(BaseGenus);

var testPlantBodySize = function testPlantBodySize(genus) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var widths = [];
  var heights = [];

  for (var i = 0; i < n; i++) {
    var _p = new SvgPlant(new genus()).body;
    _p.genus.width = 0;
    _p.genus.height = 0;

    _p.init();

    widths.push(_p.bbox.width);
    heights.push(_p.bbox.height);
  }

  widths.sort(function (a, b) {
    return a - b;
  });
  heights.sort(function (a, b) {
    return a - b;
  });
  return function () {
    var q = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
    var i = Math.max(0, Math.min(n - 1, Math.round(q / 100 * (n - 1))));
    return {
      width: widths[i],
      height: heights[i]
    };
  };
};

var findSeed = function findSeed(genus, test) {
  var timeoutMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10 * 1000;
  var cancel = false,
      n = 0,
      seed;
  var t0 = Date.now();
  var to = setTimeout(function () {
    cancel = true;
  }, timeoutMs);

  while (true) {
    var _p2 = new SvgPlant(new genus()).body;
    _p2.genus.width = 0;
    _p2.genus.height = 0;

    _p2.init();

    n++;

    if (test(_p2)) {
      clearTimeout(to);
      seed = _p2.genus.rngSeed;
      console.log('Seed found!', seed);
      break;
    }

    if (cancel) {
      console.log('No seed was found');
      break;
    }
  }

  var t = ((Date.now() - t0) / 1000).toFixed(2);
  console.log('findSeed finished after ' + t + ' seconds and ' + n + ' tries.');
  return seed;
};

var testPerformance = function testPerformance(genus) {
  var durationMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10 * 1000;
  var t0 = Date.now();
  var n = 0;

  while (true) {
    var _p3 = new SvgPlant(new genus()).body;
    _p3.genus.width = 0;
    _p3.genus.height = 0;

    _p3.init();

    n++;
    if (Date.now() - t0 > durationMs) break;
  }

  var ms = Date.now() - t0;
  var s = ms / 1000;
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

var Genera = {
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
