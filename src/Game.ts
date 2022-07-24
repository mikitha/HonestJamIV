import Workstation from './Workstation.js';
import PresserWorkstation from './PresserWorkstation.js';
import IngredientsWorkstation from './IngredientsWorkstation.js';
import CauldronWorkstation from './CauldronWorkstation.js';
import SmokerWorkstation from './SmokerWorkstation.js'
import { isControlPressed, Controls } from './keyboardInput.js';
import Recipe from './Recipe.js';

export default class Game {
    mouseXPosition: number;
    mouseYPosition: number;

    workstations: Array<Workstation>;
    currentWorkstation: Workstation;

    currentRecipe: Recipe;

    lastTimestamp = 0;

    constructor(readonly canvas: HTMLCanvasElement){
        this.mouseXPosition = 0
        this.mouseYPosition = 0
        window.addEventListener("mousemove", event =>{
           this.mouseXPosition = event.clientX;
           this.mouseYPosition = event.clientY;
        })

        window.addEventListener('click', ev => {
          this.currentWorkstation.clickableObjects.filter(co => co.isEnabled() && co.isHovering()).forEach(co => co.onClick());
          console.log(ev.clientX, ev.clientY)
        });

        window.addEventListener('mousedown', _ev => {
          this.currentWorkstation.currentlyDraggedObjects = this.currentWorkstation.draggableObjects.filter(dgo => dgo.isEnabled() && dgo.isHovering());
          this.currentWorkstation.currentlyDraggedObjects.forEach(dgo => dgo.onMouseDown());
        });

        window.addEventListener('mouseup', _ev => {
          this.currentWorkstation.currentlyDraggedObjects.forEach(dgo => dgo.onMouseUp());
          this.currentWorkstation.currentlyDraggedObjects = [];
        });

        this.run = this.run.bind(this);

        this.currentRecipe = new Recipe();

        this.workstations = [];
        this.workstations.push(new IngredientsWorkstation(this));
        this.workstations.push(new PresserWorkstation(this));
        this.workstations.push(new CauldronWorkstation(this));
        this.workstations.push(new SmokerWorkstation(this));

        this.currentWorkstation = this.workstations[1];
    }

    switchWorkstation(target: number) {
      if (this.currentWorkstation.currentlyDraggedObjects.length > 0) return;
      this.currentWorkstation = this.workstations[target];
    }

    run(timestamp: number){
        const dt = timestamp - this.lastTimestamp
        let ctx = this.canvas.getContext("2d")!;
        if (isControlPressed(Controls.WORKSPACE_1)) {
          this.switchWorkstation(0);
        }
        if (isControlPressed(Controls.WORKSPACE_2)) {
          this.switchWorkstation(1);
        }
        if (isControlPressed(Controls.WORKSPACE_3)) {
          this.switchWorkstation(2);
        }
        if(isControlPressed(Controls.WORKSPACE_4)){
            this.switchWorkstation(3)
        }
        this.currentWorkstation.tick(dt);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentWorkstation.draw(ctx);
        this.lastTimestamp = timestamp
        window.requestAnimationFrame(this.run);

    }

}
