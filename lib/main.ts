
import { SvgPlant } from './Plant/SvgPlant';
import { BaseGenus } from './Genera/BaseGenus';
import { BushyPlantGenus } from './Genera/BushyPlantGenus';
import { DragonTreeGenus } from './Genera/DragonTreeGenus';
import { ZamiaGenus } from './Genera/ZamiaGenus';
import { PileaGenus } from './Genera/PileaGenus';
import * as DevTools from './util/DevTools';
import { plantHelper } from './util/util';

const Genera = {
    'BushyPlant': BushyPlantGenus,
    'DragonTree': DragonTreeGenus,
    'Zamia': ZamiaGenus,
    'Pilea': PileaGenus,
};

export type GenusID = keyof typeof Genera;

export {
    SvgPlant,
    Genera,
    BaseGenus, BushyPlantGenus, DragonTreeGenus, ZamiaGenus, PileaGenus,

    plantHelper,
    DevTools,
};
