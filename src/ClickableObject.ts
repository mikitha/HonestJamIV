import Game from './Game.js';

export default interface ClickableObject {
  draw(ctx: CanvasRenderingContext2D): void;
  isEnabled(): boolean;
  isHovering(): boolean;
  onClick(): void;
}

class RectangularClickableObject implements ClickableObject {
  enabled = false;

  constructor(
    readonly game: Game,
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    readonly onClick: () => void,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isHovering() ? "khaki" : "brown";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  isHovering() {
    const { mouseXPosition, mouseYPosition } = this.game;
    const { x, y, w, h } = this;
    const mx = mouseXPosition;
    const my = mouseYPosition;
    return (
      mx >= x &&
      mx < x + w &&
      my >= y &&
      my < y + h
    );
  }

  isEnabled() { return this.enabled; }
}

export { RectangularClickableObject }
