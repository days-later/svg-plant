const genera = Object.values( SvgPlant.Genera );
let color, fill, seeds, genus;
let animationDir = 'right';
let plant;

function save() {
    const data = {
        color,
        fill,
        seeds,
        genus
    }
    localStorage.setItem( 'plant-demo-state', JSON.stringify( data ) );
}
function load() {
    let data = localStorage.getItem( 'plant-demo-state' );

    try {
        data = JSON.parse( data );
    }
    catch {
    }

    if (!data) data = {
        color: true,
        fill: '',
        seeds: [],
        genus: 0,
    };

    color = data.color;
    fill = data.fill || '#aaa';
    seeds = data.seeds || [];
    genus = data.genus || 0;
}
load();

const plantEl = document.getElementById( 'plant' );
const toolsEl = document.getElementById( 'tools' );
const genusEl = document.getElementById( 'genus' );
const seedEl = document.getElementById( 'seed' );

const colorBtn = document.querySelector( '.btn.color' );
const toolsBtn = document.querySelector( '.btn.tools' );
const prevBtn = document.querySelector( '.btn.prev' );
const nextBtn = document.querySelector( '.btn.next' );

function removePlants() {
    if (!animationDir) {
        plantEl.innerHTML = '';
    }
    else {
        const remove = [];
        for (i=0; i<plantEl.children.length; i++) {
            const svg = plantEl.children[ i ];

            remove.push( svg );
            if (animationDir == 'left') {
                svg.classList.remove( 'center', 'right' );
                svg.classList.add( 'left' );
            }
            else {
                svg.classList.remove( 'center', 'left' );
                svg.classList.add( 'right' );
            }
        }

        setTimeout(() => {
            for (i=0; i<remove.length; i++) remove[ i ].remove();
        }, 1000 );
    }
}
function addPlant( el ) {
    plantEl.appendChild( el );
    if (!animationDir) {
        el.classList.add( 'center' );
    }
    else {
        if (animationDir == 'left') {
            el.classList.add( 'right' );
        }
        else {
            el.classList.add( 'left' );
        }

        plantEl.offsetHeight;

        el.classList.remove( 'left', 'right' );
        el.classList.add( 'center' );
    }
}
function update() {
    plant = new SvgPlant.SvgPlant( new genera[ genus ]( seeds[ genus ] || undefined ), { color } );

    removePlants();
    addPlant( plant.svgElement );

    if (!color) {
        plant.svgElement.style.fill = fill;
        document.body.classList.add( 'dark' );
    }
    else {
        document.body.classList.remove( 'dark' );
    }
    colorBtn.classList.add( color ? 'on' : 'off' );
    colorBtn.classList.remove( color ? 'off' : 'on' );

    prevBtn.classList.remove( 'inactive' );
    nextBtn.classList.remove( 'inactive' );
    if (genus == 0) prevBtn.classList.add( 'inactive' );
    if (genus == genera.length-1) nextBtn.classList.add( 'inactive' );

    seeds[ genus ] = plant.seed;
    seedEl.innerHTML = plant.seed;
    genusEl.innerHTML = genera[ genus ].genusName;

    save();
}
update();

function setSeed( seed ) {
    seeds[ genus ] = seed;
    animationDir = false;
    update();
    plant.animate( 0, 1, 500 );
}
document.querySelector( '.btn.shuffle' ).addEventListener( 'click', () => {
    setSeed( undefined );
    hideTools();
}, { passive: true });

function hsl2rgb( h, s, l ) {
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
}
function toggleColor() {
    color = !color;
    if (!color) fill = hsl2rgb( Math.random() * 360, .5, .8 );
    animationDir = false;
    update();
    hideTools();
}
colorBtn.addEventListener( 'click', toggleColor, { passive: true });

function prev() {
    if (genus == 0) return;
    genus--;
    animationDir = 'right';
    update();
    hideTools();
}
prevBtn.addEventListener( 'click', prev, { passive: true });
function next() {
    if (genus == genera.length-1) return;
    genus++;
    animationDir = 'left';
    update();
    hideTools();
}
nextBtn.addEventListener( 'click', next, { passive: true });

function setAge( e, bb ) {
    const y = e.clientY;
    const pad = .2;
    plant.age = 1 - (y - (bb.y + bb.height*pad)) / (bb.height * (1 - pad * 2));
}
plantEl.addEventListener( 'mousedown', e => {
    const bb = plantEl.getBoundingClientRect();

    const move = e => setAge( e, bb );
    const cancel = () => {
        plantEl.removeEventListener( 'mousemove', move );
        window.removeEventListener( 'mouseup', cancel );
    }

    plantEl.addEventListener( 'mousemove', move );
    window.addEventListener( 'mouseup', cancel );

    setAge( e, bb );
});
plantEl.addEventListener( 'touchstart', e => {
    const bb = plantEl.getBoundingClientRect();

    const move = e => setAge( e.changedTouches[ 0 ], bb );
    const cancel = () => {
        plantEl.removeEventListener( 'touchmove', move );
        window.removeEventListener( 'touchend', cancel );
    }

    plantEl.addEventListener( 'touchmove', move );
    window.addEventListener( 'touchend', cancel );

    setAge( e.changedTouches[ 0 ], bb );
});

toolsBtn.addEventListener( 'click', () => {
    toolsEl.classList.toggle( 'off' );
    toolsBtn.classList.toggle( 'on' );
    toolsBtn.classList.toggle( 'off' );
}, { passive: true });
function hideTools() {
    toolsEl.classList.add( 'off' );
    toolsBtn.classList.add( 'on' );
    toolsBtn.classList.remove( 'off' );
}

function copySeedToClipboard() {
    const i = document.createElement( 'input' );
    i.type = 'text';
    i.value = seeds[ genus ];
    document.body.appendChild( i );
    i.select();
    document.execCommand("copy");
    i.remove();
}
document.querySelector( '.btn.copy-seed' ).addEventListener( 'click', copySeedToClipboard );

const seedInput = document.getElementById( 'seed-input' );
document.querySelector( '.btn.set-seed' ).addEventListener( 'click', () => {
    if (seedInput.value === "") return;
    setSeed( seedInput.value );
    seedInput.value = "";
    hideTools();
});