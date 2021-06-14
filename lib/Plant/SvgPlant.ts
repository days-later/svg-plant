import { plantPotSvg } from "./plantPotSvg";
import { PlantBody } from "./PlantBody";
import { html } from "../util/util";
import type { attributeSet, Genus } from '../types';

interface SvgPlantCfg {
    color: boolean,
    age: number,
    potSize: number,
    potPathAttr: attributeSet,
};
interface SvgPlantCfgArg {
    color?: boolean,
    age?: number,
    potSize?: number,
    potPathAttr?: attributeSet,
};

interface PlantAnimation {
    fromAge: number,
    toAge: number,
    ageSpan: number,
    currentAge: number,

    durationMs: number,

    nextAnimationFrame: undefined | number,

    paused: boolean,
};

class SvgPlant {
    body: PlantBody;
    private cfg: SvgPlantCfg;

    private _svgElement: SVGElement | null;
    private _potSvgElement: SVGElement | null;
    private _bodySvgElement: SVGElement | null;

    private animation: PlantAnimation | null;

    constructor( genus: Genus, cfg?: SvgPlantCfgArg ) {
        this.cfg = {
            color: true,
            age: 1,
            potSize: .3,
            potPathAttr: { fill: '#fc7', stroke: '#da5' },
        };

        if (typeof cfg == 'object') {
            if (cfg.color !== undefined) this.setColor( cfg.color );
            if (cfg.age !== undefined) this.setAge( cfg.age );
            if (cfg.potSize !== undefined) this.setPotSize( cfg.potSize );
            if (cfg.potPathAttr !== undefined) this.setPotPathAttr( cfg.potPathAttr );
        }

        this.body = new PlantBody( genus );

        this._svgElement = null;
        this._potSvgElement = null;
        this._bodySvgElement = null;

        this.animation = null;
    }

    get genusName(): string {
        return this.body.genus.genusName;
    }

    get seed(): string {
        return this.body.genus.rngSeed;
    }

    get color(): boolean { return this.cfg.color; }
    setColor( v: boolean ) {
        v = !!v;
        if (v != this.cfg.color) {
            this.cfg.color = v;
            this.update();
        }
    }

    get age(): number { return this.cfg.age; }
    setAge( v: number ) {
        v = Math.max( 0, Math.min( v, 1 ));
        if (v != this.cfg.age) {
            this.cfg.age = v;
            this.update( true, false );
        }
    }

    get potSize(): number { return this.cfg.potSize; }
    setPotSize( v: number ) {
        v = Math.max( 0, Math.min( v, 1 ));
        if (v != this.cfg.potSize) {
            this.cfg.potSize = v;
            this.update( false, true );
        }
    }

    get potPathAttr(): attributeSet { return this.cfg.potPathAttr; }
    setPotPathAttr( v: attributeSet ) {
        if (v !== this.cfg.potPathAttr) {
            this.cfg.potPathAttr = v;
            this.update( false, true );
        }
    }

    update( body=true, pot=true ) {
        if (body) this._bodySvgElement = null;
        if (pot) this._potSvgElement = null;
        this.updateSvgElement();
    }

    get svgElement(): SVGElement {
        if (!this._svgElement) {
            this._svgElement = this.getSvgElement();
        }
        return this._svgElement;
    }
    updateSvgElement(): void {
        const svg = this._svgElement;
        if (!svg) return;

        svg.innerHTML = this.getSvgElement().innerHTML;
    }
    getSvgElement(): SVGElement {
        const svg = html.svg.root({
            class: 'svg-plant',
            viewBox: '0 0 1 1',
            preserveAspectRatio: 'xMidYMax meet',
        });

        const place = ( el: Element, x: number, y: number, w: number, h: number ) => {
            el.setAttribute( 'x', String( x ) );
            el.setAttribute( 'y', String( y ) );
            el.setAttribute( 'width', String( w ) );
            el.setAttribute( 'height', String( h ) );
        };

        const pot = this.potSvgElement;
        const body = this.bodySvgElement;

        if (this.cfg.potSize >= 1 && pot !== null) {
            svg.appendChild( pot );
            place( pot, 0, 0, 1, 1 );
        }
        else if (this.cfg.potSize <= 0 && body !== null) {
            svg.appendChild( body );
            place( body, 0, 0, 1, 1 );
        }
        else if (pot && body) {
            svg.appendChild( pot );
            place( pot, 0, 1 - this.cfg.potSize, 1, this.cfg.potSize );
            svg.appendChild( body );

            // with high contrast there is a slight gap visible, between pot and plant.
            // without color this is way more noticable, and the slight overlap is invisible.
            const overlap = this.cfg.color ? 0 : .001;

            let height;
            const bodyHeight = 1 - this.cfg.potSize;

            if (this.body.yFactor > 1) {
                // this means the plant has points "below the fold"
                // or: points that overlap the potsize area
                // so the height of "1 - this._cfg.potSize" needs to be expanded accordingly

                const wrapperAR = 1 / bodyHeight;
                const aboveFoldBodyAR = this.body.bbox.width / -this.body.bbox.y0;
                if (wrapperAR < aboveFoldBodyAR) {
                    // the plantbody is scaled down, to fit the viewbox's width
                    // the yFactor now needs to be applied only to the plants scaled down height
                    // not the full available area of "1 - this._cfg.potSize"

                    const scaledBodyHeight = -this.body.bbox.y0 / this.body.bbox.width;
                    height = bodyHeight + (scaledBodyHeight * this.body.yFactor - scaledBodyHeight);
                }
                else {
                    height = bodyHeight * this.body.yFactor;
                }
            }
            else {
                height = bodyHeight;
            }

            place( body, 0, 0, 1, height + overlap );

        }

        return svg;
    }

    get potSvgElement(): SVGElement | null {
        if (this.cfg.potSize == 0) return null;

        if (!this._potSvgElement) {
            this._potSvgElement = this.getPotSvgElement();
        }
        return this._potSvgElement;
    }
    getPotSvgElement(): SVGElement {
        if (!this.cfg.color) return plantPotSvg({});
        return plantPotSvg( this.cfg.potPathAttr );
    }

    get bodySvgElement(): SVGElement | null {
        if (this.cfg.potSize == 1) return null;

        if (!this._bodySvgElement) {
            this._bodySvgElement = this.getBodySvgElement();
        }
        return this._bodySvgElement;
    }
    getBodySvgElement(): SVGElement {
        return this.body.getSvg( this.cfg.age, this.cfg.color );
    }

    animate( fromAge=0, toAge=1, durationMs=3000 ) {
        this.cancelAnimation();

        this.animation = {
            fromAge,
            toAge,
            ageSpan: toAge - fromAge,
            currentAge: fromAge,

            durationMs,

            nextAnimationFrame: undefined,

            paused: true,
        };

        this.resumeAnimation();
    }
    pauseAnimation() {
        if (this.animation) {
            if (this.animation.nextAnimationFrame !== undefined) {
                cancelAnimationFrame( this.animation.nextAnimationFrame );
            }
            this.animation.paused = true;
        }
    }
    cancelAnimation() {
        this.pauseAnimation();
        this.animation = null;
    }
    resumeAnimation() {
        const a = this.animation;
        if (!a || !a.paused) return;
        a.paused = false;

        this.setAge( a.currentAge );

        const acl = (t: number): number => t<0 ? 0 : t>1 ? 1 : Math.sin( (t - .5) * Math.PI ) * .5 + .5;
        const aclInv = (t: number): number => t<0 ? 0 : t>1 ? 1 : Math.asin( t * 2 - 1 ) / Math.PI + .5;

        let t0: number;
        const upd = (ts: number) => {
            if (!t0) {
                const f = (a.currentAge - a.fromAge) / a.ageSpan;
                t0 = ts - aclInv( f ) * a.durationMs;
                a.nextAnimationFrame = requestAnimationFrame( upd );
            }
            else {
                const f = acl( Math.min( 1, (ts - t0) / a.durationMs ) );

                if (f < 1) {
                    this.cfg.age = a.fromAge + f * a.ageSpan;
                    a.currentAge = this.cfg.age;

                    this._bodySvgElement = null;
                    this.updateSvgElement();

                    a.nextAnimationFrame = requestAnimationFrame( upd );
                }
                else {
                    this.setAge( a.toAge );
                    this.animation = null;
                }
            }
        };

        a.nextAnimationFrame = requestAnimationFrame( upd );
    }
}

export { SvgPlant };
