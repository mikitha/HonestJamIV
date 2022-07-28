function chooseRandom<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(array: Array<T>): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function lerp(start: number, end: number, progress: number) {
  return flerp(start, end, progress, i);
}

function flerp(start: number, end: number, progress: number, f: Function) {
  return start + f(progress) * (end - start);
}

function glerp(start: number, end: number, progress: number) {
  return flerp(start, end, progress, g);
}

function clamp(min: number, max: number, input: number) {
  return Math.min(max, Math.max(min, input));
}


function i(x: number) { return x; }
function g(x: number) { return x * x; } // gravity

export { chooseRandom, shuffle, lerp, glerp, clamp }
