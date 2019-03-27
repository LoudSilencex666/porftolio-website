const canvasBA = {
    eleDOM : window.document.querySelector('#backgroundAnimation'),

    mx : null,
    my : null,
    clicked : null,
    isDone : null,
    animationIncrement : null,
    animationOpacity : null,

    get rect() {
        return this.eleDOM.getBoundingClientRect();
    },
    get w() {
        return this.eleDOM.width;
    },
    get h() {
        return this.eleDOM.height;
    },
    get ctx() {
        return this.eleDOM.getContext('2d');
    }
}

class Tile {
    constructor(width, height, x, y, src) {
        this.image = new Image();
        this.image.src = src;
        this.isLoaded = false;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    test() {
        console.log(this.image);
    }
    
}

const tiles = [];
const tilesImageSrc = './assets/background_animation/tile7.png';

let canvasBARAF;

let tile = new Image();
let tileLoaded = false;
// let tileW = 159;
// let tileH = 137;
let tileW = 55;
let tileH = 46;
let tileRows = 0;
let tileColumns = 0;

tile.onload = () => { tileLoaded = true;};
tile.src = './assets/background_animation/tile7.png';

function getMousePos(evt) {
    return {
        x: evt.clientX - canvasBA.rect.left,
        y: evt.clientY - canvasBA.rect.top
    };
}

function canvasVars() {
    tiles[0] = new Tile(55, 46, 0, 0);
    canvasBA.animationIncrement = 1;
    canvasBA.animationOpacity = 1;
};

function canvasSizing() {
    canvasBA.eleDOM.width = document.body.clientWidth;
    canvasBA.eleDOM.height = document.body.clientHeight;
    tileRows = Math.ceil(canvasBA.eleDOM.width / tileW);
    tileColumns = Math.ceil(canvasBA.eleDOM.height / tileH) + 1;
};

function canvasMouseMovement() {
    document.body.addEventListener('mousemove', (evt) => {
        let mousePos = getMousePos(evt);
        canvasBA.mx = mousePos.x;
        canvasBA.my = mousePos.y;
    }, false);

    document.body.addEventListener('click', (evt) => {
        canvasBA.isDone = false;
        canvasBA.clicked = true;

    }, false);

    window.addEventListener("resize", (evt) => {
        canvasSizing();
    }, false);
}

function canvasBG() {
    canvasBA.ctx.fillStyle = 'rgb(22, 22, 22)';
    canvasBA.ctx.fillRect(0, 0, canvasBA.w, canvasBA.h);
}

function canvasMouseEffect() {
    if(canvasBA.clicked) {
        canvasBA.ctx.beginPath();
        canvasBA.ctx.arc(canvasBA.mx, canvasBA.my, canvasBA.animationIncrement, 0, 2 * Math.PI, false);
        
        // create radial gradient
        var grd = canvasBA.ctx.createRadialGradient(canvasBA.mx, canvasBA.my, 10, canvasBA.mx, canvasBA.my, canvasBA.animationIncrement);

        grd.addColorStop(0, `rgba(8, 146, 208, ${canvasBA.animationOpacity})`);

        grd.addColorStop(1, `rgba(22, 22, 22, ${canvasBA.animationOpacity})`);

        
        if (canvasBA.animationIncrement <= 200) { // param max spread
            canvasBA.animationIncrement += 15; // param velocity of spreading
        } else if (canvasBA.animationOpacity > 0) {
            canvasBA.animationOpacity -= 0.07;
            console.log(canvasBA.animationOpacity);
        } else {
            canvasBA.animationOpacity = 1;
            canvasBA.animationIncrement = 0;
            canvasBA.isDone = true;
        }

        canvasBA.ctx.fillStyle = grd;

        // canvasBA.ctx.fillStyle = 'rgba(0, 0, 111, 1)';

        canvasBA.ctx.fill();
        tiles[0].test();

    }

    if(canvasBA.isDone) {
        canvasBA.clicked = false;
    }
}

function canvasTiles() {
    if(tileLoaded) {
        for (let i = 0; i < tileColumns; i++) {
            for (let j = 0; j < tileRows; j++) {
                canvasBA.ctx.drawImage(tile, -tileW / 2 + (1.5*j * tileW), -tileH / 2 + (i * tileH));
            }
        }

        for (let i = 0; i < tileColumns; i++) {
            for (let j = 0; j < tileRows; j++) {
                canvasBA.ctx.drawImage(tile, tileW / 4 + (1.5*j * tileW), 0 + (i * tileH));
            }
        }

    }
    // if(tileLoaded) {
    //     canvasBA.ctx.drawImage(tile, 0, 0, canvasBA.w, canvasBA.h);
    // }
}




function canvasBAInit() {
    canvasVars();
    canvasSizing();
    canvasMouseMovement();
    canvasBAUpdate();
}

function canvasBAUpdate() {
    canvasBG();
    canvasMouseEffect();
    canvasTiles();
    canvasBARAF = window.requestAnimationFrame(canvasBAUpdate);
}