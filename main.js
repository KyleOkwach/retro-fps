
/*
----------------------------------------
                GAME CODE
----------------------------------------
*/

const screenCanvas = new Canvas(document.getElementById("display"), settings.canvasW, settings.canvasH, utils.colors[9])
const screenCtx = screenCanvas.canvas.getContext("2d");

const controls = new Controls();
const game = new Game(screenCtx, controls);


let msPrev = performance.now();  // elapsed time since oage loaded in ms
const FPS = 30;
const msPerFrame = 1000 / FPS

let showFPS = false;
var lastLoop = new Date();
let fps = 0;

function animate() {
    requestAnimationFrame(animate);

    game.update();
    
    const msNow = performance.now();
    const deltaTime = msNow - msPrev;

    if(deltaTime < msPerFrame) return;

    const excessTime = deltaTime % msPerFrame;
    msPrev = msNow - excessTime;

    var thisLoop = new Date();
    fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
}

if(showFPS) {
    setInterval(() => {
        console.log(fps)
    }, 1000)
}

animate();