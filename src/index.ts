import Game from "./Game.js";
import { load as loadImages } from './images.js';
import { load as loadAudio, audioCtx, bgm } from './audio.js';

let canvas: HTMLCanvasElement;
window.addEventListener('load', async () => {

  await loadImages();
  await loadAudio();
  document.querySelector('#loading')?.remove();

  (document.querySelector('#startScreen') as HTMLDivElement).style.display = "flex";
  await new Promise(resolve => {
    document.querySelector('#startButton')?.addEventListener('click', resolve)
  })

  const startAudio = () => {
    const gainNode = audioCtx.createGain();
    const bufferSource = audioCtx.createBufferSource();
    bufferSource.buffer = bgm('swish');
    bufferSource.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    bufferSource.start(0);
  };
  startAudio()
  document.querySelector('#startScreen')?.remove();


  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  resizeCanvas();


  new Game(canvas).run(0)
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
