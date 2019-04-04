const canvasBA = {
    eleDOM : window.document.querySelector('#backgroundAnimation'),

    mx : null,
    my : null,
    clicked : null,
    bombsAnimation : {
        isDone : true,
        animationIncrement : 0,
        animationOpacity : 1,
        countdownToDrop : null,
        detonationX : null,
        detonationY : null,
        bombColor : null,
        isDropped : null,
        dropVelocity : 0
    },
    
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
        this.staticWidth = width; // may be useful in other animation mods
        this.staticHeight = height; // may be useful in other animation mods
        this.width = width;
        this.height = height;
        this.row = row;
        this.column = column;
        this.animationVars = {
            isRisingDone : false,
            isFallingDone : false,
            isAnimationDone : true,
            rowMaxRange : this.row,
            randomPropabilityNumber : Math.floor(Math.random() * 7)
        }
    }

    drawTiles() {
        if(this.id % 2 === 0 && this.animationVars.randomPropabilityNumber !== 0) {
            canvasBA.ctx.drawImage(this.image, -this.staticWidth / 2 + (this.column * this.staticWidth * 0.73), -this.staticHeight / 2 + (this.row * this.staticHeight));
        } else if(this.animationVars.randomPropabilityNumber !== 0) {
            canvasBA.ctx.drawImage(this.image, -this.staticWidth / 2 + (this.column * this.staticWidth * 0.73), 0 + (this.row * this.staticHeight));
        }
    }

    animateMovement() {
        if (!this.animationVars.isAnimationDone) {
        
            if (!this.animationVars.isRisingDone) {
                
                if (this.row > this.animationVars.rowMaxRange - 0.2) {
                    this.row -= 0.01;
                } else {
                    this.animationVars.isRisingDone = true;
                }
            }

            if (!this.animationVars.isFallingDone && this.animationVars.isRisingDone) {
                if (this.row < this.animationVars.rowMaxRange + 0.2) {
                    this.row += 0.01;
                } else {
                    this.animationVars.isFallingDone = true;
                }
            }

            if (this.animationVars.isRisingDone && this.animationVars.isFallingDone) {
                if (this.row > this.animationVars.rowMaxRange) {
                    this.row -= 0.01;
                } else {
                    this.animationVars.isAnimationDone = true;
                    this.animationVars.isRisingDone = false;
                    this.animationVars.isFallingDone = false;
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
    console.log('animation mod 1 with bombs');
    // ANIMATION MOD 1
    for (let i = 0; i < tileColumns; i++) {

        for (let j = i; j < tiles.length; j += tileColumns) {
            setTimeout(()=> {
                tiles[j].animationVars.isAnimationDone = false;
            }, i * 100);
        }

        
    }

}

function canvasMouseMovement() {
    document.body.addEventListener('mousemove', (evt) => {
        let mousePos = getMousePos(evt);
        canvasBA.mx = mousePos.x;
        canvasBA.my = mousePos.y;
    }, false);

    document.body.addEventListener('click', (evt) => {
        // canvasBA.bombsAnimation.isDone = false;
        canvasBA.clicked = true;

    }, false);

    window.addEventListener("resize", (evt) => {
        canvasSizing();
    }, false);
}

function canvasBG() {
    canvasBA.ctx.fillStyle = 'rgb(33, 33, 33)';
    canvasBA.ctx.fillRect(0, 0, canvasBA.w, canvasBA.h);
}

/* atomic bomb after LMB click */

// function canvasMouseEffect() { 
//     if(canvasBA.clicked) {
//         canvasBA.ctx.beginPath();
//         canvasBA.ctx.arc(canvasBA.mx, canvasBA.my, canvasBA.animationIncrement, 0, 2 * Math.PI, false);
        
//         // create radial gradient
//         var grd = canvasBA.ctx.createRadialGradient(canvasBA.mx, canvasBA.my, 10, canvasBA.mx, canvasBA.my, canvasBA.animationIncrement);

//         grd.addColorStop(0, `rgba(8, 146, 208, ${canvasBA.animationOpacity})`);

//         grd.addColorStop(1, `rgba(22, 22, 22, ${canvasBA.animationOpacity})`);

        
//         if (canvasBA.animationIncrement <= 1000) { // param max spread
//             canvasBA.animationIncrement += 7; // param velocity of spreading
//         } else if (canvasBA.animationOpacity > 0) {
//             canvasBA.animationOpacity -= 0.07;
//         } else {
//             canvasBA.animationOpacity = 1;
//             canvasBA.animationIncrement = 0;
//             canvasBA.isDone = true;
//         }

//         canvasBA.ctx.fillStyle = grd;

//         // canvasBA.ctx.fillStyle = 'rgba(0, 0, 111, 1)';

//         canvasBA.ctx.fill();
        
//     }

//     if(canvasBA.isDone) {
//         canvasBA.clicked = false;
//     }
// }

function canvasBombsDrop() {
    if(canvasBA.bombsAnimation.isDone && canvasBA.bombsAnimation.countdownToDrop <= 0) {
        canvasBA.bombsAnimation.countdownToDrop = Math.floor(Math.random() * 1) + 2;
        canvasBA.bombsAnimation.detonationX = Math.floor(Math.random() * canvasBA.w);
        canvasBA.bombsAnimation.detonationY = Math.floor(Math.random() * canvasBA.h);
        canvasBA.bombsAnimation.bombColor = `${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}`;
        canvasBA.bombsAnimation.isDone = false;
        canvasBA.bombsAnimation.isDropped = false;
    }
    
    if(canvasBA.bombsAnimation.countdownToDrop > 0) {
        canvasBA.bombsAnimation.countdownToDrop -= 0.01667;
    }

    if(canvasBA.bombsAnimation.countdownToDrop <= 0) {
        canvasBA.bombsAnimation.isDropped = true;
    }

    /* bomb drop animation */

    // if(canvasBA.bombsAnimation.countdownToDrop <= 0 && !canvasBA.bombsAnimation.isDropped) {
        
    //     canvasBA.bombsAnimation.dropVelocity += 1;

    //     canvasBA.ctx.beginPath();
    //     canvasBA.ctx.moveTo(canvasBA.bombsAnimation.detonationX, canvasBA.bombsAnimation.detonationY + 100);
    //     canvasBA.ctx.lineTo(canvasBA.bombsAnimation.detonationX, canvasBA.bombsAnimation.detonationY + 100 - canvasBA.bombsAnimation.dropVelocity);
    //     canvasBA.ctx.strokeStyle = '#FFF';
    //     canvasBA.ctx.stroke();

    //     if(canvasBA.bombsAnimation.dropVelocity > 100) {
    //         canvasBA.bombsAnimation.isDropped = true;
    //         canvasBA.bombsAnimation.dropVelocity = 0;
    //     }
    // }
}

function canvasBombsExplosion() {


    if(canvasBA.bombsAnimation.isDropped) {
        canvasBA.ctx.beginPath();
        canvasBA.ctx.arc(canvasBA.bombsAnimation.detonationX, canvasBA.bombsAnimation.detonationY, canvasBA.bombsAnimation.animationIncrement, 0, 2 * Math.PI, false);
        
        // create radial gradient
        var grd = canvasBA.ctx.createRadialGradient(canvasBA.bombsAnimation.detonationX, canvasBA.bombsAnimation.detonationY, 10, canvasBA.bombsAnimation.detonationX, canvasBA.bombsAnimation.detonationY, canvasBA.bombsAnimation.animationIncrement);

        grd.addColorStop(0, `rgba(${canvasBA.bombsAnimation.bombColor}, ${canvasBA.bombsAnimation.animationOpacity})`);

        grd.addColorStop(1, `rgba(22, 22, 22, ${canvasBA.bombsAnimation.animationOpacity})`);

        
        if (canvasBA.bombsAnimation.animationIncrement <= 2000) { // param max spread
            canvasBA.bombsAnimation.animationIncrement += 7; // param velocity of spreading
        } else if (canvasBA.bombsAnimation.animationOpacity > 0) {
            canvasBA.bombsAnimation.animationOpacity -= 0.01;
        } else {
            canvasBA.bombsAnimation.animationOpacity = 1;
            canvasBA.bombsAnimation.animationIncrement = 0;
            canvasBA.bombsAnimation.isDone = true;
            canvasBA.bombsAnimation.isDropped = false;
        }

        canvasBA.ctx.fillStyle = grd;

        canvasBA.ctx.fill();
        
    }

}

function canvasTiles() {
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].drawTiles();
        //tiles[i].animateMovement();
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
    canvasBombsExplosion();
    canvasTiles();
    canvasBombsDrop();
    canvasBARAF = window.requestAnimationFrame(canvasBAUpdate);
}