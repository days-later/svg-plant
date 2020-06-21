import { rng, nodePos, nodeAttr, offshoot, node } from "../util/util";
import { rngSeed, attributeSet, leafCurvesHandles, leafDefinition, Genus } from '../types';
declare class BaseGenus implements Genus {
    rng: rng;
    width: number;
    height: number;
    maxBranchNum: number;
    segmentStyle: attributeSet;
    leafStyle: attributeSet;
    leafCurveHandles: leafCurvesHandles;
    constructor(rngSeed?: rngSeed);
    static get genusName(): string;
    get genusName(): string;
    get rngSeed(): string;
    reset(): void;
    getRoots(): offshoot[];
    getOffshoots(node: node): offshoot[];
    getNodeWidth(_pos: nodePos, _prev: node | null, _attr: nodeAttr): number;
    getSegmentLength(_pos: nodePos, _prev: node | null, _attr: nodeAttr): number;
    getSegmentAngle(pos: nodePos, prev: node, _attr: nodeAttr): any;
    getSegmentStyle(_n0: node, _n1: node): attributeSet;
    getLeaves(_n0: node, n1: node): leafDefinition[];
}
export { BaseGenus };
