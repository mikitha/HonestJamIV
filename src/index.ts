console.log("Hello world");

let canvas: HTMLCanvasElement;
window.addEventListener('load', async () => {
  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  resizeCanvas();

  canvas.getContext('2d')?.fillRect(200, 200, 200, 200);
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
