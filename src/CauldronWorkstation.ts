import Workstation from './Workstation.js';
import ClickableObject from './ClickableObject.js';
import DraggableObject, { RectangularDraggableObject } from './DraggableObject.js';
import Game from './Game.js';
import { StirDirection } from './Recipe.js';

export default class CauldronWorkstation implements Workstation {
  spoonOffsetX = 0;
  spoonOffsetY = 0;
  spoon: Spoon;

  progress = 0;
  center = [0, 0];
  centerPositions: Array<[number, number]> = [];
  maxCenterPositions = 50;

  quadrant = 0;

  started = true;

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

    if (this.started) {
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
        else if ((4 + quadrant - this.quadrant) % 4 === 1) {
          this.progress -= 5;
        } else {
          this.progress += 5;
        }
        this.quadrant = quadrant;
      } else {
        this.progress -= Math.sign(this.progress) * .5
        this.centerPositions = [];
      }
    }

    if (this.progress > 300) {
      this.progress = 300;
      this.game.currentRecipe.stirred = StirDirection.CLOCKWISE;
      this.started = false;
    } else if (this.progress < -300) {
      this.progress = -300;
      this.game.currentRecipe.stirred = StirDirection.COUNTERCLOCKWISE;
      this.started = false;
    }

    this.game.busy = (this.progress > -300 && this.progress < 300) && this.progress !== 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.spoon.draw(ctx);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.center[0], this.center[1], 25, 0, 2 * Math.PI);
    //ctx.fill();
    this.game.currentRecipe.draw(ctx, 400, 500);
    this.drawProgressBar(ctx);
  }

  drawProgressBar(ctx: CanvasRenderingContext2D) {
    ctx.strokeRect(200, 50, 600, 50);
    ctx.fillStyle = this.progress > 0 ? "green" : "red";
    ctx.fillRect(500, 50, this.progress, 50);
  }
}

class Spoon extends RectangularDraggableObject {
  constructor(readonly workstation: Workstation, readonly onMouseDown: () => void, readonly onMouseUp: () => void) {
    super(workstation, 300, 200, 25, 300, onMouseDown, onMouseUp)
  }
  isEnabled() { return true; }
}
