import Workstation from './Workstation.js';
import ClickableObject from './ClickableObject.js';
import Game from './Game.js';

export default class CauldronWorkstation implements Workstation {
  constructor(readonly game: Game) {}
  clickableObjects: Array<ClickableObject> = [];
  tick(_dt: number) {}
  draw(_ctx: CanvasRenderingContext2D) {}
}

class Spoon implements ClickableObject {
  draw(_ctx: CanvasRenderingContext2D) {}
  isEnabled() { return true; }
  isHovering() { return false; }
  onClick() {}
}
