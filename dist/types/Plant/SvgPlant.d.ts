import { PlantBody } from "./PlantBody";
import { attributeSet, Genus } from '../types';
interface SvgPlantCfgArg {
    color?: boolean;
    age?: number;
    potSize?: number;
    potPathAttr?: attributeSet;
}
declare class SvgPlant {
    body: PlantBody;
    private cfg;
    private _svgElement;
    private _potSvgElement;
    private _bodySvgElement;
    private animation;
    constructor(genus: Genus, cfg?: SvgPlantCfgArg);
    get seed(): string;
    get color(): boolean;
    set color(v: boolean);
    get age(): number;
    set age(v: number);
    get potSize(): number;
    set potSize(v: number);
    get potPathAttr(): attributeSet;
    set potPathAttr(v: attributeSet);
    update(body?: boolean, pot?: boolean): void;
    get svgElement(): SVGElement;
    updateSvgElement(): void;
    getSvgElement(): SVGElement;
    get potSvgElement(): SVGElement | null;
    getPotSvgElement(): SVGElement;
    get bodySvgElement(): SVGElement | null;
    getBodySvgElement(): SVGElement;
    animate(fromAge?: number, toAge?: number, durationMs?: number): void;
    pauseAnimation(): void;
    cancelAnimation(): void;
    resumeAnimation(): void;
}
export { SvgPlant };
