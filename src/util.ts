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
  return start + (progress * (end - start));
}

export { chooseRandom, shuffle, lerp }
