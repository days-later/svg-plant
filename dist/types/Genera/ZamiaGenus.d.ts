import { BaseGenus } from "./BaseGenus";
import { node, nodePos, nodeAttr } from "../util/util";
import { Genus, rngSeed } from '../types';
declare class ZamiaGenus extends BaseGenus implements Genus {
    constructor(rngSeed?: rngSeed);
    getRoots(): {
        n: number;
        attr: {
            branchArchAngle: number;
            x: number;
            segmentAngle: number;
        };
    }[];
    getOffshoots(_node: node): never[];
    getNodeWidth(_pos: nodePos, prev: node | null, _attr: nodeAttr): number;
    getSegmentLength(_pos: nodePos, prev: node | null, _attr: nodeAttr): number;
    getSegmentAngle(pos: nodePos, prev: node, _attr: nodeAttr): number;
    getSegmentStyle(): import("../types").attributeSet;
    getLeaves(_n0: node, n1: node): {
        angle: any;
        length: number;
        handles: import("../types").leafCurvesHandles;
        style: import("../types").attributeSet;
        xOffset: number;
        yOffset: number;
    }[];
}
export { ZamiaGenus };
