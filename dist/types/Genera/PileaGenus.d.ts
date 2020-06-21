import { BaseGenus } from "./BaseGenus";
import { node, offshoot, nodePos, nodeAttr } from "../util/util";
import { Genus, rngSeed, attributeSet } from '../types';
declare class PileaGenus extends BaseGenus implements Genus {
    offshootSegmentStyle: attributeSet;
    branchSegmentStyle: attributeSet;
    constructor(rngSeed?: rngSeed);
    getRoots(): {
        n: number;
        attr: {
            x: number;
            segmentAngle: number;
        };
    }[];
    getOffshoots(node: node): offshoot[];
    getNodeWidth(pos: nodePos, prev: node | null, _attr: nodeAttr): any;
    getSegmentLength(pos: nodePos, prev: node | null, _attr: nodeAttr): number;
    getSegmentAngle(pos: nodePos, prev: node, _attr: nodeAttr): number;
    getSegmentStyle(n0: node, _n1: node): attributeSet;
    getLeaves(n0: node, n1: node): {
        angle: number;
        length: number;
        handles: import("../types").leafCurvesHandles;
        style: attributeSet;
        xOffset: number;
        yOffset: number;
    }[];
}
export { PileaGenus };
