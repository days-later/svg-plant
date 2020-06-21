import { BBox } from "../util/util";
import { Genus } from '../types';
declare class PlantBody {
    genus: Genus;
    bbox: BBox;
    yFactor: number;
    private parts;
    private maxAge;
    constructor(genus: Genus);
    private getTree;
    init(): void;
    private render;
    getSvg(age: number, colors: boolean): SVGElement;
}
export { PlantBody };
