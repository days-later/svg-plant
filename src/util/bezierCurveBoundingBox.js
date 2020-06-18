// ripped from https://github.com/kfitfk/svg-boundings

var MIN_X = 'minX';
var MAX_X = 'maxX';
var MIN_Y = 'minY';
var MAX_Y = 'maxY';

/**
 * expand the x-bounds, if the value lies outside the bounding box
 */
function expandXBounds(bounds, value) {
  if (bounds[MIN_X] > value) bounds[MIN_X] = value;
  else if (bounds[MAX_X] < value) bounds[MAX_X] = value;
}

/**
 * expand the y-bounds, if the value lies outside the bounding box
 */
function expandYBounds(bounds, value) {
  if (bounds[MIN_Y] > value) bounds[MIN_Y] = value;
  else if (bounds[MAX_Y] < value) bounds[MAX_Y] = value;
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

    if (a+c !== 2*b) b += 0.0001;

    var numerator = 2*(a - b);
    var denominator = 2*(a - 2*b + c);
    if (denominator === 0) denominator = 0.0001;
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

    if (a+c !== 2*b) b += 0.0001;

    numerator = 2*(a - b);
    denominator = 2*(a - 2*b + c);
    if (denominator === 0) denominator = 0.0001;
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

export { bezierCurveBoundingBox };