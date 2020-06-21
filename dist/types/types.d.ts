import { rng, node, offshoot, nodeAttr, nodePos } from "./util/util";
export interface attributeSet {
    [key: string]: string | number;
}
export declare type point = [number, number];
export declare type pathDescriptionSegment = string | point | [string, number, number];
export declare type rngSeed = undefined | string | number;
export interface leafCurvesHandles {
    bottomAngle: number;
    bottomLength: number;
    topAngle: number;
    topLength: number;
}
export interface leafDefinition {
    angle: number;
    length: number;
    handles: leafCurvesHandles;
    style: attributeSet;
    xOffset: number;
    yOffset: number;
}
export interface Genus {
    rng: rng;
    width: number;
    height: number;
    maxBranchNum: number;
    genusName: string;
    rngSeed: string;
    reset(): void;
    getRoots(): offshoot[];
    getOffshoots(node: node): offshoot[];
    getNodeWidth(pos: nodePos, prev: node | null, attr: nodeAttr): number;
    getSegmentLength(_pos: nodePos, _prev: node | null, _attr: nodeAttr): number;
    getSegmentAngle(pos: nodePos, prev: node, _attr: nodeAttr): number;
    getSegmentStyle(_n0: node, _n1: node): attributeSet;
    getLeaves(_n0: node, n1: node): leafDefinition[];
}
export interface GenusConstructor {
    new (seed?: rngSeed): Genus;
}
