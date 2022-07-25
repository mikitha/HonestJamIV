import Game from './Game.js';

export default class Hover {
  constructor(readonly game: Game, readonly text: string, readonly image?: HTMLImageElement) {}

  width = 200;
  height = 50;
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "grey";
    ctx.fillRect(this.game.mouseXPosition, this.game.mouseYPosition, this.width, this.height);

    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.game.mouseXPosition + this.width / 2, this.game.mouseYPosition + this.height / 2, this.width)
  }
}
