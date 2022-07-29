import Game from "./Game.js";
import { load as loadImages } from './images.js';
import { load as loadAudio } from './audio.js';

let canvas: HTMLCanvasElement;
window.addEventListener('load', async () => {
  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  resizeCanvas();

  await loadImages();
  await loadAudio();

  new Game(canvas).run(0)
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
