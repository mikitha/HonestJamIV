import Workstation from './Workstation.js';
import ClickableObject from './ClickableObject.js';
import DraggableObject, { RectangularDraggableObject } from './DraggableObject.js';
import Game from './Game.js';

export default class CauldronWorkstation implements Workstation {
  spoonOffsetX = 0;
  spoonOffsetY = 0;
  spoon: Spoon;

  constructor(readonly game: Game) {
    this.spoon = new Spoon(this, this.onMouseDownSpoon.bind(this), () => {});
  }

  onMouseDownSpoon() {
    this.spoonOffsetX = this.spoon.x - this.game.mouseXPosition;
    this.spoonOffsetY = this.spoon.y - this.game.mouseYPosition;
  }

  clickableObjects: Array<ClickableObject> = [];
  draggableObjects = [];
  currentlyDraggedObjects: Array<DraggableObject> = [];
  tick(_dt: number) {
    this.currentlyDraggedObjects.forEach(cdo => {
      cdo.x = this.game.mouseXPosition + this.spoonOffsetX;
      cdo.y = this.game.mouseYPosition + this.spoonOffsetY;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.spoon.draw(ctx);
  }
}

class Spoon extends RectangularDraggableObject {
  constructor(readonly workstation: Workstation, readonly onMouseDown: () => void, readonly onMouseUp: () => void) {
    super(workstation, 300, 200, 25, 300, onMouseDown, onMouseUp)
  }
  isEnabled() { return true; }
}
