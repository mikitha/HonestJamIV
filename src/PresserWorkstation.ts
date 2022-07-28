import Workstation from './Workstation.js';
import Game from './Game.js';
import ClickableObject from './ClickableObject.js';
import DraggableObject, { RectangularDraggableObject } from './DraggableObject.js';

import images from './images.js';
import { potionImage } from './Recipe.js';

import { glerp, clamp, lerp } from './util.js';

export default class PresserWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  draggableObjects = [];
  currentlyDraggedObjects: Array<DraggableObject> = [];
  drips: Array<PresserDrip> = [];
  progress = 0;
  fullProgress = 20;
  
  lastCrankPosition = 0;
  crankBoundaryTop = 100;
  crankBoundaryBottom = 400;
  crankMovingUp = false
  isClicked = false
  crank: Crank;

  constructor(readonly game: Game) {
    this.crank = new Crank(this, this.onMouseDownCrank.bind(this), this.onMouseUpCrank.bind(this));
  }

  onMouseDownCrank() {
    this.isClicked = true;
  }

  onMouseUpCrank() {
    this.isClicked = false;
  }

  tick(dt: number) {
    this.drips = this.drips.filter(d => d.enabled);
    this.drips.forEach(d => d.tick(dt));
    //let crankPositionChange = this.game.mouseYPosition - this.lastCrankPosition;
    if (this.isClicked){
      this.crank.y = this.game.mouseYPosition;
      this.crank.y = Math.min(this.crankBoundaryBottom, this.crank.y);
      this.crank.y = Math.max(this.crankBoundaryTop, this.crank.y);
    }

    if (this.progress < this.fullProgress){
    
    if(this.crankBoundaryBottom == this.crank.y && this.crankMovingUp == false){
        this.progress += 1
     
        this.crankMovingUp = true

        this.drips.push(new PresserDrip(100, 300, "red"));
    }

    if(this.crankBoundaryTop == this.crank.y && this.crankMovingUp == true){
      this.progress += 1
       
        this.crankMovingUp = false
        this.drips.push(new PresserDrip(100, 300, "red"));
    }
  
    if(this.progress == this.fullProgress){

    console.log("done!")
    this.game.currentRecipe.pressed = true
    console.log(this.game.currentRecipe.toString())
    console.log(this.game.currentRecipe)
    }

    this.game.busy = this.progress > 0 && this.progress < this.fullProgress;
  }
}

  draw(ctx: CanvasRenderingContext2D) {
    this.drawCrank(ctx);
    this.drawProgress(ctx);
    ctx.beginPath();       // Start a new path
    ctx.moveTo(400, this.crankBoundaryTop);    // Move the pen to (30, 50)
    ctx.lineTo(600, this.crankBoundaryTop);  // Draw a line to (150, 100)
    ctx.moveTo(400, this.crankBoundaryBottom)
    ctx.lineTo(600, this.crankBoundaryBottom)
    ctx.stroke(); 

    this.game.currentRecipe.draw(ctx, 150, 400);

    this.drips.forEach(d => d.draw(ctx));

    ctx.fillStyle = "lightgrey";
    ctx.fillRect(100, 100, 128, 128);

    ctx.drawImage(potionImage("#559900", 'potion-white', 'potion-bottle-empty'), 100, 100);
    ctx.drawImage(potionImage("#EE2277", 'potion-white', 'potion-bottle-empty'), 100, 164);
    ctx.drawImage(potionImage("#88AA22", 'potion-white', 'potion-bottle-empty'), 164, 100);
    ctx.drawImage(potionImage("#884411", 'potion-white', 'potion-bottle-empty'), 164, 164);

    ctx.drawImage(images('potion-bottle-empty'), 100, 100);
  }

  drawProgress(ctx: CanvasRenderingContext2D){
    ctx.strokeRect(20, 600, 200, 25);

    if(this.progress <= 5){
      ctx.fillStyle = "red"
    }
   else if(this.progress <= 10){
      ctx.fillStyle = "purple"
    }
    else if (this.progress <= 19){
      ctx.fillStyle = "blue"
    }
    else if (this.progress = this.fullProgress){
      ctx.fillStyle = "green"
    }

    ctx.fillRect(20, 600, this.progress*10, 25);

  }

  drawCrank(ctx: CanvasRenderingContext2D){
    this.crank.draw(ctx)
  }
}

class Crank extends RectangularDraggableObject {
  constructor(readonly workstation: PresserWorkstation, readonly onMouseDown: () => void, readonly onMouseUp: () => void) {
    super(workstation, 400, workstation.crankBoundaryTop, 200, 50, onMouseDown, onMouseUp);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  isEnabled(): boolean {
    return true
  }
}

class PresserDrip {
  readonly startFallTime = 500;
  readonly fallDist = 50;
  readonly endFallTime = 800;
  readonly maxRadius = 7;
  x: number;
  y: number;
  progress = 0;
  enabled = true;

  constructor(readonly startX: number, readonly startY: number, readonly color: string) {
    this.x = startX;
    this.y = startY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.enabled) return;
    const radius = clamp(0, this.maxRadius, lerp(0, this.maxRadius, this.progress * (this.endFallTime / this.startFallTime)));
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  tick(dt: number) {
    if (!this.enabled) return;
    const progressMultiplier = 1 / (this.endFallTime);
    this.progress += dt * progressMultiplier;
    if (this.progress * this.endFallTime > this.startFallTime) {
      this.y = glerp(this.startY, this.startY + this.fallDist, ((this.progress * this.endFallTime) - this.startFallTime)/(this.endFallTime - this.startFallTime));
    }
    if (this.progress > 1) {
      this.enabled = false;
    }
  }
}

