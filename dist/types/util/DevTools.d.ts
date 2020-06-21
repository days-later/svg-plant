import { PlantBody } from "../Plant/PlantBody";
import { GenusConstructor } from '../types';
declare const testPlantBodySize: (genus: GenusConstructor, n?: number) => (q?: number) => {
    width: number;
    height: number;
};
declare const findSeed: (genus: GenusConstructor, test: (p: PlantBody) => boolean, timeoutMs?: number) => string | undefined;
declare const testPerformance: (genus: GenusConstructor, durationMs?: number) => void;
export { testPlantBodySize, findSeed, testPerformance, };
