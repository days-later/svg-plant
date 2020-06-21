import { BaseGenus } from "./BaseGenus";
import { node, offshoot, nodePos, nodeAttr } from "../util/util";
import { Genus, rngSeed, leafDefinition } from '../types';
declare class DragonTreeGenus extends BaseGenus implements Genus {
    constructor(rngSeed?: rngSeed);
    getRoots(): {
        n: number;
        attr: {
            x: number;
            segmentAngle: number;
        };
    }[];
    getOffshoots(node: node): offshoot[];
    getNodeWidth(pos: nodePos, prev: node, _attr: nodeAttr): any;
    getSegmentLength(pos: nodePos, _prev: node, _attr: nodeAttr): number;
    getSegmentAngle(pos: nodePos, prev: node, _attr: nodeAttr): number;
    getSegmentStyle(_n0: node, _n1: node): import("../types").attributeSet;
    getLeaves(_n0: node, n1: node): leafDefinition[];
}
export { DragonTreeGenus };
