import Game from './Game.js';

export default class ClickableObject {
  isHovering = false;

  constructor(
    readonly game: Game,
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    public enabled: boolean,
    readonly onHover: Function,
    readonly onClick: Function,
    readonly draw: Function,
  ) {
    game.clickableObjects.push(this);
  }

  tick(_: number) {
    if (!this.enabled) {
      this.isHovering = false;
      return;
    }

    console.log(this.game)

    this.isHovering = (
      this.game.mouseXPosition > this.x &&
      this.game.mouseXPosition < this.x + this.w &&
      this.game.mouseYPosition > this.y &&
      this.game.mouseYPosition < this.y + this.h
    )
  }

  drawObject(ctx: CanvasRenderingContext2D) {
    if (this.enabled) this.draw(ctx);
  }
}
