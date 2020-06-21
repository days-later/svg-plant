import { attributeSet, pathDescriptionSegment, point, rngSeed } from '../types';
declare const html: {
    node(tag: string, set?: attributeSet | undefined): Element;
    nodeNS(tag: string, set: attributeSet, ns: string): Element;
    attr(node: Element, set?: attributeSet): void;
    svg: {
        root(set?: attributeSet | undefined): SVGElement;
        node(tag: string, set?: attributeSet | undefined): SVGElement;
        compilePathDescription(points: pathDescriptionSegment[]): string;
    };
};
declare const math: {
    toRadians(degrees: number): number;
    fromAngle(point: point, angle: number, length: number, precision?: number | undefined): point;
    rectFromLine(pointBottom: point, pointTop: point, angleBottom: number, angleTop: number, widthBottom: number, widthTop: number, precision?: number | undefined): [point, point, point, point];
    pointOnLine(p1: point, p2: point, d: number): point;
    distance(p1: point, p2: point): number;
};
declare const plantHelper: {
    rootPosAngle(rng: rng, xMax: number, maxAngle: number): {
        x: number;
        segmentAngle: number;
    };
    segmentAngle(baseNode: node): number;
    nextAngle(rng: rng, pos: nodePos, prevNode: node, variance: number, alternate: boolean): number;
    archingBranchAngle(rng: rng, pos: nodePos, prevNode: node, variance: number, numAdjust: number): number;
    repeat<T, U = number>({ rng, cb, p, shuffle, steps, values, n }: {
        rng: rng;
        cb: (i: number | U) => T;
        steps?: {
            from: number;
            to: number;
            step: number;
        } | undefined;
        values?: U[] | undefined;
        n?: number | [number, number] | undefined;
        p?: number | undefined;
        shuffle?: boolean | undefined;
    }): T[];
};
interface rng {
    seed: string;
    reset(): void;
    random(v: number): number;
    test(p: number): boolean;
    test<T, U>(p: number, pass: T, fail: U): T | U;
    test<T, U>(p: number, pass?: T, fail?: U): T | U | boolean;
    range(v0: number, v1: number): number;
    intRange(v0: number, v1: number): number;
    ranges(...ranges: Array<[number, number, number?]>): number;
    shuffle(a: Array<any>): Array<any>;
}
declare const rng: (seed: rngSeed) => rng;
interface bboxData {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    [propName: string]: any;
}
declare class BBox {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    constructor(data?: bboxData);
    addX(v: number): this;
    addY(v: number): this;
    addPoint(x: number, y: number): this;
    addBBox(bbox: bboxData): this;
    expand(v: number): this;
    contains(bbox: bboxData, strict: boolean): boolean;
    containedBy(bbox: bboxData, strict: boolean): boolean;
    containsPoint(x: number, y: number, strict: boolean): boolean;
    clone(): BBox;
    withPrecision(p: number): BBox;
    get width(): number;
    get height(): number;
    get aspectRatio(): number;
    get data(): bboxData;
    get pointsArray(): [point, point];
    get viewBox(): string;
}
interface nodePos {
    num: number;
    branchNum: number;
    height: number;
    offshootHeight: number;
    isRoot: boolean;
    isLast: boolean;
    isLastBranch: boolean;
    isOffshoot: boolean;
    numFactor: number;
    branchFactor: number;
}
interface nodeAttr {
    [key: string]: any;
}
interface offshoot {
    n: number;
    attr?: nodeAttr;
}
interface node {
    pos: nodePos;
    attr: nodeAttr;
    offshoots: node[];
    prev: node | null;
    next: node | null;
    branchRoot: node;
    treeRoot: node;
    offshootNum: number;
}
declare type getNode = (pos: nodePos, prev: node | null, rootAttr: nodeAttr) => nodeAttr;
declare type getOffshoots = (node: node | null) => offshoot[];
declare class ProcTree {
    maxBranchNum: number;
    getNode: getNode;
    getOffshoots: getOffshoots;
    private roots;
    constructor(maxBranchNum: number, getNode: getNode, getOffshoots: getOffshoots);
    grow(): void;
    growBranch(rootNode: node | null, offshootNum: number, segmentCount: number, attr: nodeAttr): void;
    addNode(prev: node | null, isOffshoot: boolean, offshootNum: number, maxNum: number, rootAttr: nodeAttr): node;
    getPos(prev: nodePos | null, isOffshoot: boolean, maxNum: number): nodePos;
    eachSegment(cb: (n0: node, n1: node) => void): void;
    _each(node: node | null, cb: (n0: node, n1: node) => void): void;
}
export { html, math, plantHelper, rng, rng as rngInterface, BBox, ProcTree, nodePos, nodeAttr, offshoot, node };
