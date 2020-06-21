import { BaseGenus } from "./BaseGenus";
import { node, nodePos, nodeAttr } from "../util/util";
import { rngSeed, Genus, leafDefinition } from '../types';
declare class BushyPlantGenus extends BaseGenus implements Genus {
    constructor(rngSeed?: rngSeed);
    getRoots(): {
        n: number;
        attr: {
            x: number;
            segmentAngle: number;
        };
    }[];
    getOffshoots(node: node): {
        n: number;
        attr: {
            segmentAngle: any;
        };
    }[];
    getNodeWidth(pos: nodePos, prev: node | null, _attr: nodeAttr): any;
    getSegmentLength(pos: nodePos, prev: node | null, _attr: nodeAttr): any;
    getSegmentAngle(pos: nodePos, prev: node, _attr: nodeAttr): number;
    getSegmentStyle(_n0: node, _n1: node): import("../types").attributeSet;
    getLeaves(_n0: node, n1: node): leafDefinition[];
}
export { BushyPlantGenus };
