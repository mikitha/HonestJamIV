import Workstation from './Workstation.js';
import Game from './Game.js';

export default class IngredientsWorkstation implements Workstation {
  constructor(readonly game: Game) {
  }

  tick(_dt: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "50pt sans-serif";
    ctx.fillStyle = "blue";
    ctx.fillText('Ingredients', 200, 200);
  }
}
