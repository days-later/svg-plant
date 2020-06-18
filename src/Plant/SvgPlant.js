import { plantPotSvg } from "./plantPotSvg";
import { PlantBody } from "./PlantBody";
import { html } from "../util/util";

class SvgPlant {

    constructor( genus, cfg ) {
        this._cfg = {
            color: true,
            age: 1,
            potSize: .3,
            potPathAttr: { fill: '#fc7', stroke: '#da5' },
        };
        if (typeof cfg == 'object') {
            for (let key in this._cfg) {
                if (key in cfg) this[ key ] = cfg[ key ];
            }
        }

        this.body = new PlantBody( genus );
    }

    get seed() {
        return this.body.genus.rngSeed;
    }

    get color() { return this._cfg.color; }
    set color( v ) {
        v = !!v;
        if (v != this._cfg.color) {
            this._cfg.color = v;
            this.update();
        }
    }

    get age() { return this._cfg.age; }
    set age( v ) {
        v = Math.max( 0, Math.min( v, 1 ));
        if (v != this._cfg.age) {
            this._cfg.age = v;
            this.update( true, false );
        }
    }

    get potSize() { return this._cfg.potSize; }
    set potSize( v ) {
        v = Math.max( 0, Math.min( v, 1 ));
        if (v != this._cfg.potSize) {
            this._cfg.potSize = v;
            this.update( false, true );
        }
    }

    get potPathAttr() { return this._cfg.potPathAttr; }
    set potPathAttr( v ) {
        if (v != this._cfg.potPathAttr) {
            this._cfg.potPathAttr = v;
            this.update( false, true );
        }
    }

    update( body=true, pot=true ) {
        if (body) this._bodySvgElement = null;
        if (pot) this._potSvgElement = null;
        this.updateSvgElement();
    }

    get svgElement() {
        if (!this._svgElement) {
            this._svgElement = this.getSvgElement();
        }
        return this._svgElement;
    }
    updateSvgElement() {
        const svg = this._svgElement;
        if (!svg) return;

        svg.innerHTML = this.getSvgElement().innerHTML;
    }
    getSvgElement() {
        const svg = html.svg.root({
            class: 'svg-plant',
            viewBox: '0 0 1 1',
            preserveAspectRatio: 'xMidYMax meet',
        });

        const place = ( el, x, y, w, h ) => {
            el.setAttribute( 'x', x );
            el.setAttribute( 'y', y );
            el.setAttribute( 'width', w );
            el.setAttribute( 'height', h );
        };

        const pot = this.potSvgElement;
        const body = this.bodySvgElement;

        if (this._cfg.potSize >= 1) {
            svg.appendChild( pot );
            place( pot, 0, 0, 1, 1 );
        }
        else if (this._cfg.potSize <= 0) {
            svg.appendChild( body );
            place( body, 0, 0, 1, 1 );
        }
        else {
            svg.appendChild( pot );
            place( pot, 0, 1 - this._cfg.potSize, 1, this._cfg.potSize );
            svg.appendChild( body );

            // with high contrast there is a slight gap visible, between pot and plant.
            // without color this is way more noticable, and the slight overlap is invisible.
            const overlap = this._cfg.color ? 0 : .001;

            let height;
            const bodyHeight = 1 - this._cfg.potSize;

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

    get potSvgElement() {
        if (this._cfg.potSize == 0) return null;

        if (!this._potSvgElement) {
            this._potSvgElement = this.getPotSvgElement();
        }
        return this._potSvgElement;
    }
    getPotSvgElement() {
        if (!this._cfg.color) return plantPotSvg();
        return plantPotSvg( this._cfg.potPathAttr );
    }

    get bodySvgElement() {
        if (this._cfg.potSize == 1) return null;

        if (!this._bodySvgElement) {
            this._bodySvgElement = this.getBodySvgElement();
        }
        return this._bodySvgElement;
    }
    getBodySvgElement() {
        return this.body.getSvg( this._cfg.age, this._cfg.color );
    }

    animate( fromAge=0, toAge=1, durationMs=3000 ) {
        this.cancelAnimation();

        this._animation = {
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
        if (this._animation) {
            cancelAnimationFrame( this._animation.nextAnimationFrame );
            this._animation.paused = true;
        }
    }
    cancelAnimation() {
        this.pauseAnimation();
        this._animation = null;
    }
    resumeAnimation() {
        const a = this._animation;
        if (!a || !a.paused) return;
        a.paused = false;

        this.age = a.currentAge;

        const acl = t => t<0 ? 0 : t>1 ? 1 : Math.sin( (t - .5) * Math.PI ) * .5 + .5;
        const aclInv = t => t<0 ? 0 : t>1 ? 1 : Math.asin( t * 2 - 1 ) / Math.PI + .5;

        let t0;
        const upd = ts => {
            if (!t0) {
                const f = (a.currentAge - a.fromAge) / a.ageSpan;
                t0 = ts - aclInv( f ) * a.durationMs;
                a.nextAnimationFrame = requestAnimationFrame( upd );
            }
            else {
                const f = acl( Math.min( 1, (ts - t0) / a.durationMs ) );

                if (f < 1) {
                    this._cfg.age = a.fromAge + f * a.ageSpan;
                    a.currentAge = this._cfg.age;

                    this._bodySvgElement = null;
                    this.updateSvgElement();

                    a.nextAnimationFrame = requestAnimationFrame( upd );
                }
                else {
                    this.age = a.toAge;
                    this._animation = null;
                }
            }
        };

        a.nextAnimationFrame = requestAnimationFrame( upd );
    }
}

export { SvgPlant };