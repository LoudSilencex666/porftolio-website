const canvasBA = {
    eleDOM : window.document.querySelector('#backgroundAnimation'),

    mx : null,
    my : null,

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

let canvasBARAF;

let tile = new Image();
let tileLoaded = false;
// let tileW = 159;
// let tileH = 137;
let tileW = 95;
let tileH = 82;
tile.onload = () => { tileLoaded = true;};
tile.src = './assets/background_animation/tile4.png';

function getMousePos(evt) {
    return {
        x: evt.clientX - canvasBA.rect.left,
        y: evt.clientY - canvasBA.rect.top
    };
}

function canvasMouseMovement() {
    document.body.addEventListener('mousemove', (evt) => {
        let mousePos = getMousePos(evt);
        canvasBA.mx = mousePos.x;
        canvasBA.my = mousePos.y;
    }, false);
}

function canvasSizing() {
    canvasBA.eleDOM.width = document.body.clientWidth;
    canvasBA.eleDOM.height = document.body.clientHeight;
};

function canvasBG() {
    canvasBA.ctx.fillStyle = 'rgb(22, 22, 22)';
    canvasBA.ctx.fillRect(0, 0, canvasBA.w, canvasBA.h);
}

function canvasMouseEffect() {
    canvasBA.ctx.beginPath();
    canvasBA.ctx.arc(canvasBA.mx, canvasBA.my, 200, 0, 2 * Math.PI, false);
    // create radial gradient
    var grd = canvasBA.ctx.createRadialGradient(canvasBA.mx, canvasBA.my, 10, canvasBA.mx, canvasBA.my, 200);

    grd.addColorStop(0, 'rgba(8, 146, 208, 1)');

    grd.addColorStop(1, 'rgba(22, 22, 22, 1)');

    canvasBA.ctx.fillStyle = grd;

    // canvasBA.ctx.fillStyle = 'rgba(0, 0, 111, 1)';

    canvasBA.ctx.fill();

}

function canvasTiles() {
    if(tileLoaded) {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                canvasBA.ctx.drawImage(tile, -tileW / 2 + (1.5*j * tileW), -tileH / 2 + (i * tileH));
            }
        }

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                canvasBA.ctx.drawImage(tile, tileW / 4 + (1.5*j * tileW), 0 + (i * tileH));
            }
        }

    }
    // if(tileLoaded) {
    //     canvasBA.ctx.drawImage(tile, 0, 0, canvasBA.w, canvasBA.h);
    // }
}




function canvasBAInit() {
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