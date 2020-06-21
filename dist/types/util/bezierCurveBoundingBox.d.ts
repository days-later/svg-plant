/**
 * Calculate the bounding box for this bezier curve.
 * http://pomax.nihongoresources.com/pages/bezier/
 */
declare function bezierCurveBoundingBox(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number): {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
};
export { bezierCurveBoundingBox };
