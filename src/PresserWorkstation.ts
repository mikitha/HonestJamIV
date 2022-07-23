import Workstation from './Workstation.js';
import Game from './Game.js';

export default class PresserWorkstation implements Workstation {
  clickableObjects = [];

  constructor(readonly game: Game) {}

  tick(_dt: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    this.drawCrank(ctx);
  }

  drawCrank(ctx: CanvasRenderingContext2D){
    ctx.fillStyle = "black";
    ctx.fillRect(400, this.game.mouseYPosition, 200, 50);
  }
}

