interface Workstation {
  tick(dt: number): void,
  draw(ctx: CanvasRenderingContext2D): void,
}

export default Workstation;
