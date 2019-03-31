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
    constructor(id, width, height, row, column, src) {
        this.id = id;
        this.image = new Image();
        this.image.src = src;
        this.isLoaded = false;
        this.width = width;
        this.height = height;
        this.row = row;
        this.column = column;
        this.rowMaxRange = row;
        this.animationStates = {
            isRisingDone : false,
            isFallingDone : false,
            isAnimationDone : true
        }
    }

    draw() {
        if(this.id % 2 === 0) {
            canvasBA.ctx.drawImage(this.image, -this.width / 2 + (this.column * this.width * 0.73), -this.height / 2 + (this.row * this.height));
        } else {
            canvasBA.ctx.drawImage(this.image, -this.width / 2 + (this.column * this.width * 0.73), 0 + (this.row * this.height));
        }
    }

    animate() {
        if (!this.animationStates.isAnimationDone) {
        
            if (!this.animationStates.isRisingDone) {
                
                if (this.row > this.rowMaxRange - 0.2) {
                    this.row -= 0.01;
                } else {
                    this.animationStates.isRisingDone = true;
                }
            }

            if (!this.animationStates.isFallingDone && this.animationStates.isRisingDone) {
                if (this.row < this.rowMaxRange + 0.2) {
                    this.row += 0.01;
                } else {
                    this.animationStates.isFallingDone = true;
                }
            }

            if (this.animationStates.isRisingDone && this.animationStates.isFallingDone) {
                if (this.row > this.rowMaxRange) {
                    this.row -= 0.01;
                } else {
                    this.animationStates.isAnimationDone = true;
                    this.animationStates.isRisingDone = false;
                    this.animationStates.isFallingDone = false;
                }
            }

        }   

    }
    
}

const   tiles = [],
        tilesImageSrc = './assets/background_animation/tile7.png',
        tileW = 55, //159
        tileH = 46; // 137

let     canvasBARAF,
        tileRows = 0,
        tileColumns = 0;
        tilesCounter = 0;

function getMousePos(evt) {
    return {
        x: evt.clientX - canvasBA.rect.left,
        y: evt.clientY - canvasBA.rect.top
    };
}

function canvasVars() {
    canvasBA.animationIncrement = 1;
    canvasBA.animationOpacity = 1;
};

function canvasSizing() {
    canvasBA.eleDOM.width = document.body.clientWidth;
    canvasBA.eleDOM.height = document.body.clientHeight;
    tileColumns = 2 * Math.ceil(canvasBA.eleDOM.width / tileW);
    tileRows = Math.ceil(canvasBA.eleDOM.height / tileH) + 1;

    for (let i = 0; i < tileRows; i++) {
        for (let j = 0; j < tileColumns; j++) {
            tiles[tilesCounter] = new Tile(tilesCounter, tileW, tileH, i, j, tilesImageSrc);
            tilesCounter++
        }
    }

    tilesCounter = 0;
};

function canvasAnimationInterval() {
    console.log(tiles.length,tileRows, tileColumns, tiles[0].row, tiles[0].column);
    // ANIMATION MOD 1
    for (let i = 0; i < tileColumns; i++) {

        for (let j = i; j < tiles.length; j += tileColumns) {
            setTimeout(()=> {
                tiles[j].animationStates.isAnimationDone = false;
            }, i * 100);
        }
        console.log(i);
    }

    setTimeout(canvasAnimationInterval, 7000)
}

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
        } else {
            canvasBA.animationOpacity = 1;
            canvasBA.animationIncrement = 0;
            canvasBA.isDone = true;
        }

        canvasBA.ctx.fillStyle = grd;

        // canvasBA.ctx.fillStyle = 'rgba(0, 0, 111, 1)';

        canvasBA.ctx.fill();
        
    }

    if(canvasBA.isDone) {
        canvasBA.clicked = false;
    }
}

function canvasTiles() {
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].draw();
        tiles[i].animate();
    }


    // for (let i = 0; i < tiles.length; i++) {
    //     tiles[i].draw();
    // }

}




function canvasBAInit() {
    canvasVars();
    canvasSizing();
    canvasAnimationInterval();
    canvasMouseMovement();
    canvasBAUpdate();
}

function canvasBAUpdate() {
    canvasBG();
    canvasMouseEffect();
    canvasTiles();
    canvasBARAF = window.requestAnimationFrame(canvasBAUpdate);
}