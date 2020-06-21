// ripped from https://github.com/kfitfk/svg-boundings

interface bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/**
 * expand the x-bounds, if the value lies outside the bounding box
 */
function expandXBounds(bounds: bounds, value: number) {
  if (bounds.minX > value) bounds.minX = value;
  else if (bounds.maxX < value) bounds.maxX = value;
}

/**
 * expand the y-bounds, if the value lies outside the bounding box
 */
function expandYBounds(bounds: bounds, value: number) {
  if (bounds.minY > value) bounds.minY = value;
  else if (bounds.maxY < value) bounds.maxY = value;
}

/**
 * Calculate the bezier value for one dimension at distance 't'
 */
function calculateBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  var mt = 1-t;
  return (mt*mt*mt*p0) + (3*mt*mt*t*p1) + (3*mt*t*t*p2) + (t*t*t*p3);
}

/**
 * Calculate the bounding box for this bezier curve.
 * http://pomax.nihongoresources.com/pages/bezier/
 */
function bezierCurveBoundingBox(
  x1: number, y1: number,
  cx1: number, cy1: number, cx2: number, cy2: number,
  x2: number, y2: number
) {
  var bounds = {
    minX: Math.min(x1, x2),
    minY: Math.min(y1, y2),
    maxX: Math.max(x1, x2),
    maxY: Math.max(y1, y2),
  };

  var dcx0 = cx1 - x1;
  var dcy0 = cy1 - y1;
  var dcx1 = cx2 - cx1;
  var dcy1 = cy2 - cy1;
  var dcx2 = x2 - cx2;
  var dcy2 = y2 - cy2;

  if (cx1<bounds.minX || cx1>bounds.maxX || cx2<bounds.minX || cx2>bounds.maxX) {
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

  if (cy1<bounds.minY || cy1>bounds.maxY || cy2<bounds.minY || cy2>bounds.maxY) {
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
    x0: bounds.minX,
    x1: bounds.maxX,
    y0: bounds.minY,
    y1: bounds.maxY,
  };
}

export { bezierCurveBoundingBox };