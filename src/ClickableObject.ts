import Game from './Game.js';
import Workstation from './Workstation.js';
import UI from './UI.js';
import Hover from './Hover.js';

export default interface ClickableObject {
  draw(ctx: CanvasRenderingContext2D): void;
  isEnabled(): boolean;
  isHovering(): boolean;
  onClick(): void;
  hover?: Hover;
}

class RectangularClickableObject implements ClickableObject {
  enabled = false;
  game: Game;
  hover?: Hover;

  constructor(
    readonly workstation: Workstation | UI,
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    readonly onClick: () => void,
  ) {
    this.game = workstation.game;
    this.workstation.clickableObjects.push(this);
  }

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
