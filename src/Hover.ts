import Game from './Game.js';
import Textbox from './Textbox.js';

import images from './images.js';

export default class Hover {
  textbox: Textbox;
  constructor(readonly game: Game, readonly text: string, readonly image?: HTMLImageElement) {
    this.textbox = new Textbox(images('ui/textbox-1'), 10, 10, [0, 0], [190, 60], text);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.textbox.draw(ctx, [this.game.mouseXPosition + 5, this.game.mouseYPosition + 5]);
  }
}
