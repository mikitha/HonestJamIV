import Workstation from './Workstation.js';
import Game from './Game.js';

export default class PresserWorkstation implements Workstation {
  clickableObjects = [];
  progress = 0;
  fullProgress = 20;
  currentCrankPosition = 0;
  lastCrankPosition = 0;
  crankBoundaryTop = 100;
  crankBoundaryBottom = 400;
  crankMovingUp = false

  constructor(readonly game: Game) {}

  tick(_dt: number) {
    //let crankPositionChange = this.game.mouseYPosition - this.lastCrankPosition;
    this.currentCrankPosition = this.game.mouseYPosition;
    this.currentCrankPosition = Math.min(this.crankBoundaryBottom, this.currentCrankPosition)
    this.currentCrankPosition = Math.max(this.crankBoundaryTop, this.currentCrankPosition) 

    if (this.progress < this.fullProgress){
    
    if(this.crankBoundaryBottom == this.currentCrankPosition && this.crankMovingUp == false){
        this.progress += 1
     
        this.crankMovingUp = true
    }

    if(this.crankBoundaryTop == this.currentCrankPosition && this.crankMovingUp == true){
      this.progress += 1
       
        this.crankMovingUp = false
    }
  
    if(this.progress == this.fullProgress){

    console.log("done!")
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
    ctx.fillStyle = "black";
    ctx.fillRect(400, this.currentCrankPosition, 200, 50);
  }
}

