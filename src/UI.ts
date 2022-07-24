import Game from './Game.js';
import images from './images.js';

import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';

export default class UI {
  trashcan: RectangularClickableObject;
  trashcanImage = images('ui/trashcan');
  clickableObjects: Array<ClickableObject> = [];

  leftMargin = 10;
  bottomMargin = 10;

  constructor(readonly game: Game) {
    const tci = this.trashcanImage;
    this.trashcan = new RectangularClickableObject(
      this,
      this.bottomMargin,
      game.canvas.height - tci.height - this.leftMargin,
      tci.width,
      tci.height,
      this.clickTrashcan.bind(this)
    );
    this.trashcan.isEnabled = () => true;
  };

  clickTrashcan() {
    this.game.resetCurrentRecipe();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawTrashcan(ctx);
  }

  drawTrashcan(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.trashcanImage, this.trashcan.x, this.trashcan.y);
  }
}
