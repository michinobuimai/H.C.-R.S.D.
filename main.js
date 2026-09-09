import * as maze from "./maze.js";

const CELL_SIZE = 20;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const slider = document.getElementById("nSlider");
const nValue = document.getElementById("nValue");
const speedSlider = document.getElementById("speedSlider");

const playBtn = document.getElementById("playBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");

const stepIcon = stepBtn.querySelector("span");
const resetIcon = resetBtn.querySelector("span");

let n = Number(slider.value);
let speed = Number(speedSlider.value);
let generator = new maze.MazeGenerator(n, ctx, CELL_SIZE);
let playing = false;


// Canvas
function setupCanvas() {
    const gridSize = maze.getGridSize(n) + 1;
    canvas.width = gridSize * CELL_SIZE;
    canvas.height = gridSize * CELL_SIZE;
    const scale = canvas.clientWidth / canvas.width;
    ctx.lineWidth = 1 / scale;
    const darkness = (6 - n) / n;
    const color = Math.floor(220 - darkness * 150);
    ctx.strokeStyle = `rgb(${color}, ${color}, ${color})`;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(gridSize);
        ctx.fillStyle = "black";

}

function drawGrid(gridSize) {
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
}


function drawStep() {
    return generator.nextStep();
}




function resetGenerator() {
    generator = new maze.MazeGenerator(n, ctx, CELL_SIZE);
    setupCanvas();
}

function stopPlaying() {
    playing = false;
    playBtn.textContent = "▶";
    playBtn.classList.remove("pause");
    playBtn.classList.add("play");
}


function animate() {
    if (!playing)
        return;
    if (speed >= Number(speedSlider.max)) {
        while (drawStep()) {}
        stopPlaying();
        return;
    }

    const more = drawStep();

    if (!more) {
        stopPlaying();
        return;
    }

    const t = speed / 1000;
    const delay = Math.pow(1 - t, 2) * 1000;

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, delay);
}
slider.addEventListener("input", () => {
    n = Number(slider.value);
    nValue.textContent = n;

    resetGenerator();
});
speedSlider.addEventListener("input", () => {
    speed = Number(speedSlider.value);
});
playBtn.addEventListener("click", () => {
    playing = !playing;

    if (playing) {
        playBtn.textContent = "❚❚";
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");

        animate();
    } else {
        stopPlaying();
    }
});
stepBtn.addEventListener("click", () => {
    if (stepIcon.getAnimations().length > 0)
        return;

    stepIcon.classList.add("scroll");

    drawStep();
});
stepIcon.addEventListener("animationend", () => {
    stepIcon.classList.remove("scroll");
});
resetBtn.addEventListener("click", () => {
    if (resetIcon.getAnimations().length > 0)
        return;

    resetIcon.classList.add("rotate");

    resetGenerator();
});
resetIcon.addEventListener("animationend", () => {
    resetIcon.classList.remove("rotate");
});

setupCanvas();