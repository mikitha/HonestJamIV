import Workstation from './Workstation.js';
import Game from './Game.js';

import ClickableObject from './ClickableObject.js'

export default class IngredientsWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  constructor(readonly game: Game) {
    function drawDoor(this: ClickableObject, ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.isHovering ? 'red' : 'blue';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    this.clickableObjects.push(new ClickableObject(
      this.game,
      100,
      150,
      50,
      50,
      true,
      () => {},
      () => {},
      drawDoor,
    ))
  }

  tick(_dt: number) {
    this.clickableObjects.forEach(co => co.tick(_dt));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "50pt sans-serif";
    ctx.fillStyle = "blue";
    ctx.fillText('Ingredients', 200, 200);

    this.clickableObjects.forEach(co => co.draw(ctx));
  }
}
