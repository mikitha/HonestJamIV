import Workstation from './Workstation.js';
import ClickableObject from './ClickableObject.js';
import DraggableObject, { RectangularDraggableObject } from './DraggableObject.js';
import Game from './Game.js';

export default class CauldronWorkstation implements Workstation {
  spoonOffsetX = 0;
  spoonOffsetY = 0;
  spoon: Spoon;

  progress = 0;
  center = [0, 0];
  centerPositions: Array<[number, number]> = [];
  maxCenterPositions = 50;

  quadrant = 0;

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
    const [mouseX, mouseY] = [this.game.mouseXPosition, this.game.mouseYPosition];
    this.currentlyDraggedObjects.forEach(cdo => {
      cdo.x = mouseX + this.spoonOffsetX;
      cdo.y = mouseY + this.spoonOffsetY;
    });

    if (this.currentlyDraggedObjects.includes(this.spoon)) {
      this.centerPositions.unshift([mouseX, mouseY]);
      this.centerPositions = this.centerPositions.slice(0, 50);

      this.center = this.centerPositions.reduce((acc, n) => {
        return [acc[0] + (n[0] / this.centerPositions.length), acc[1] + (n[1] / this.centerPositions.length)]
      } ,[0, 0]);
      let quadrant;
      if (mouseY < this.center[1]) {
        quadrant = mouseX > this.center[0] ? 0 : 1;
      } else {
        quadrant = mouseX > this.center[0] ? 3 : 2;
      }

      if (quadrant === this.quadrant) {}
      else if (quadrant > this.quadrant || (quadrant === 0 && this.quadrant === 3)) {
        this.progress += 1;
      } else {
        this.progress -= 1;
      }
      this.quadrant = quadrant;
    } else {
      this.centerPositions = [];
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.spoon.draw(ctx);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.center[0], this.center[1], 25, 0, 2 * Math.PI);
    ctx.fill();
    this.game.currentRecipe.draw(ctx, 400, 500);
  }
}

class Spoon extends RectangularDraggableObject {
  constructor(readonly workstation: Workstation, readonly onMouseDown: () => void, readonly onMouseUp: () => void) {
    super(workstation, 300, 200, 25, 300, onMouseDown, onMouseUp)
  }
  isEnabled() { return true; }
}
