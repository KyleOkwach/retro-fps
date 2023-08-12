/*
----------------------------------------
                GAME CODE
----------------------------------------
*/

const screenCanvas = new Canvas(document.getElementById("display"), settings.canvasW, settings.canvasH, utils.colors[9]);
const controls = new Controls();
const game = new Game(screenCanvas, controls);


let msPrev = performance.now();  // elapsed time since oage loaded in ms
const FPS = 60;
const msPerFrame = 1000 / settings.FPS;

let showFPS = true;
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
    fps = Math.round(1000 / (thisLoop - lastLoop));
    lastLoop = thisLoop;
}

if(showFPS) {
    setInterval(() => {
        utils.textOutput(document.getElementById("fps"), "FPS", fps)
    }, 1000)
}

animate();