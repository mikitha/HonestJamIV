import Workstation from './Workstation.js';
import Game from './Game.js';
import ClickableObject from './ClickableObject.js';

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
    this.crank = new Crank(this)


  }

  tick(_dt: number) {
    //let crankPositionChange = this.game.mouseYPosition - this.lastCrankPosition;
    if (this.isClicked){
    this.crank.position = this.game.mouseYPosition;
    this.crank.position = Math.min(this.crankBoundaryBottom, this.crank.position);
    this.crank.position = Math.max(this.crankBoundaryTop, this.crank.position);
    }

    if (this.progress < this.fullProgress){
    
    if(this.crankBoundaryBottom == this.crank.position && this.crankMovingUp == false){
        this.progress += 1
     
        this.crankMovingUp = true
    }

    if(this.crankBoundaryTop == this.crank.position && this.crankMovingUp == true){
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

class Crank implements ClickableObject{

  position
  
  constructor(readonly workstation: PresserWorkstation) {
    this.workstation.clickableObjects.push(this);
    this.position = this.workstation.crankBoundaryTop;
  }
  

  draw(ctx: CanvasRenderingContext2D): void {
    
    ctx.fillStyle = "black";
    ctx.fillRect(400, this.position, 200, 50);
  }
  isEnabled(): boolean {
    return true
  }
  isHovering(): boolean {
    const { mouseXPosition, mouseYPosition } = this.workstation.game;
    const x = 400;
    const y = this.position;
    const w = 200;
    const h = 50;
    const mx = mouseXPosition;
    const my = mouseYPosition;
    return (
      mx >= x &&
      mx < x + w &&
      my >= y &&
      my < y + h
    );
  }
  
  onClick(): void {
    this.workstation.isClicked = !this.workstation.isClicked
  }
  
}

