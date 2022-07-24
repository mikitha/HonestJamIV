import Workstation from './Workstation.js';
import Game from './Game.js';
import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';

export default class PresserWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  progress = 0;
  fullProgress = 20;
  
  lastCrankPosition = 0;
  crankBoundaryTop = 100;
  crankBoundaryBottom = 400;
  crankMovingUp = false
  isClicked = false
  crank: Crank;

  constructor(readonly game: Game) {
    this.crank = new Crank(this, this.onClickCrank.bind(this));
  }

  onClickCrank() {
    this.isClicked = !this.isClicked;
  }

  tick(_dt: number) {
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
    }

    if(this.crankBoundaryTop == this.crank.y && this.crankMovingUp == true){
      this.progress += 1
       
        this.crankMovingUp = false
    }
  
    if(this.progress == this.fullProgress){

    console.log("done!")
    this.game.currentRecipe.pressed = true
    console.log(this.game.currentRecipe.toString())
    console.log(this.game.currentRecipe)
    }
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
  }

  drawProgress(ctx: CanvasRenderingContext2D){
    ctx.strokeRect(20, 600, 200, 25);

    if(this.progress <= 5){
      ctx.fillStyle = "red"
    }
   else if(this.progress <= 10){
      ctx.fillStyle = "purple"
    }
    else if (this.progress <= 15){
      ctx.fillStyle = "blue"
    }
    else if (this.progress <= 20){
      ctx.fillStyle = "green"
    }

    ctx.fillRect(20, 600, this.progress*10, 25);

  }

  drawCrank(ctx: CanvasRenderingContext2D){
    this.crank.draw(ctx)
  }
}

class Crank extends RectangularClickableObject {
  constructor(readonly workstation: PresserWorkstation, readonly onClick: () => void) {
    const { game, crankBoundaryTop } = workstation;
    super(game, 400, crankBoundaryTop, 200, 50, onClick);
    this.workstation.clickableObjects.push(this);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  isEnabled(): boolean {
    return true
  }
}

