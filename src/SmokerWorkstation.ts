import Workstation from './Workstation.js';
import Game from './Game.js';
import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';
import DraggableObject from './DraggableObject.js';
import Hover from './Hover.js';

export default class SmokerWorkstation implements Workstation {
    clickableObjects: Array<ClickableObject> = [];
    draggableObjects = [];
    currentlyDraggedObjects: Array<DraggableObject> = [];
    progress = 0;
    fullProgress = 5;
    
    smokerFlip = false
    lastSmokerPosition = 0;
    smokerBoundaryTop = 100;
    smokerkBoundaryBottom = 400;
    smokerSpinning = false
    isClicked = false
    smoker: Smoker;
    startButton: ClickableObject
    
 
    constructor(readonly game: Game) {
      this.smoker = new Smoker(this, this.clickSmoker.bind(this));
      this.startButton = new RectangularClickableObject(this, 20, 560, 100, 30, this.startSmoking.bind(this))
      this.startButton.isEnabled = () => true
      this.startButton.hover = new Hover(this.game, "Start the smoker");
    }

    reset() {
      this.progress = 0;
      this.smoker.started = false;
    }
  
    startSmoking() {
      if (!this.game.currentRecipe.ingredients.length) {
        this.game.alert("Can't start the smoker without ingredients");
        return;
      }
      this.smoker.started = true;
      this.smoker.turn();
      this.progress = 0;
    }

    clickSmoker(){
        if (this.progress < this.fullProgress) this.smoker.turn();
    }
  
    tick(dt: number) {
      this.smoker.tick(dt);
      if (this.progress >= this.fullProgress) {
        this.game.currentRecipe.smoked = true;
      }
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      this.drawsmoker(ctx);
      this.drawProgress(ctx);
    
      this.startButton.draw(ctx);
      this.game.currentRecipe.draw(ctx, 150, 400);
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
      this.game.busy = this.smoker.started && this.progress < this.fullProgress;
  
    }
  
    drawsmoker(ctx: CanvasRenderingContext2D){
      this.smoker.draw(ctx)
    }
  }
  
  class Smoker extends RectangularClickableObject {
    progress: number = 0;
    started = false;
    constructor(readonly workstation: SmokerWorkstation, readonly onClick: () => void) {
      super(workstation, 485, 89, 100, 400, onClick);
    }

    turn() {
      this.progress = 0;
    }
  
    tick(dt: number) {
      if (this.progress === 1) return;
       if (this.started == true){ 
        this.progress += dt/1000
       }
       if (this.progress > 1){
          this.progress = 1;
          this.workstation.progress += 1;
       }
    }

    draw(ctx: CanvasRenderingContext2D): void {
      ctx.fillStyle = "blue";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.fillRect(this.x, this.y, this.w, this.h);

      ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.w, this.progress*this.h/2)
        ctx.fillRect(this.x, this.y+(this.h/2), this.w, (1-this.progress)*this.h/2)

      if(this.progress > 0){
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x+(this.w/3), this.y+(this.h/2), this.w/3, this.h/2);
      }
    }
  
    isEnabled(): boolean {
      return this.progress === 1;
    }
  }
  
  
