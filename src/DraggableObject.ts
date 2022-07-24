import Game from './Game.js';
import Workstation from './Workstation.js';

export default interface DraggableObject {
  onMouseDown(): void,
  onMouseUp(): void,
  x: number,
  y: number,
  isHovering(): boolean,
  isEnabled(): boolean,
}

class RectangularDraggableObject implements DraggableObject {
  enabled = false;
  game: Game;

  constructor(
    readonly workstation: Workstation,
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    readonly onMouseDown: () => void,
    readonly onMouseUp: () => void,
  ) {
    this.game = workstation.game;
    this.workstation.draggableObjects.push(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isHovering() ? "blue" : "lightblue";
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

export { RectangularDraggableObject }
