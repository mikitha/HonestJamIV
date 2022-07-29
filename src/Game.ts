import Workstation from './Workstation.js';
import StorefrontWorkstation from './StorefrontWorkstation.js';
import PresserWorkstation from './PresserWorkstation.js';
import IngredientsWorkstation from './IngredientsWorkstation.js';
import CauldronWorkstation from './CauldronWorkstation.js';
import SmokerWorkstation from './SmokerWorkstation.js'

import UI from './UI.js';
import { isControlPressed, Controls } from './keyboardInput.js';
import Recipe from './Recipe.js';
import Order from './Order.js';

export default class Game {
    mouseXPosition: number;
    mouseYPosition: number;

    workstations: Array<Workstation>;
    currentWorkstationIndex: number;

    ui: UI;

    currentRecipe: Recipe;
    currentOrder?: Order;

    busy = false;

    lastTimestamp = 0;

    constructor(readonly canvas: HTMLCanvasElement){
        this.mouseXPosition = 0
        this.mouseYPosition = 0
        window.addEventListener("mousemove", event =>{
           this.mouseXPosition = event.clientX;
           this.mouseYPosition = event.clientY;
        })

        window.addEventListener('click', ev => {
          console.log(`Clicked at x=${ev.clientX}, y=${ev.clientY}`);

          const clickableUIObjects = this.ui.clickableObjects.filter(co => co.isEnabled() && co.isHovering())
          if (clickableUIObjects.length) {
            clickableUIObjects.forEach(co => co.onClick());
            return;
          }

          if (this.ui.prompt) return;

          this.currentWorkstation.clickableObjects.filter(co => co.isEnabled() && co.isHovering()).forEach(co => co.onClick());
        });

        window.addEventListener('mousedown', _ev => {
          if (this.ui.prompt) return;
          this.currentWorkstation.currentlyDraggedObjects = this.currentWorkstation.draggableObjects.filter(dgo => dgo.isEnabled() && dgo.isHovering());
          this.currentWorkstation.currentlyDraggedObjects.forEach(dgo => dgo.onMouseDown());
        });

        window.addEventListener('mouseup', _ev => {
          if (this.ui.prompt) return;
          this.currentWorkstation.currentlyDraggedObjects.forEach(dgo => dgo.onMouseUp());
          this.currentWorkstation.currentlyDraggedObjects = [];
        });

        this.run = this.run.bind(this);

        this.currentRecipe = new Recipe();

        this.workstations = [];
        this.workstations.push(new StorefrontWorkstation(this));
        this.workstations.push(new IngredientsWorkstation(this));
        this.workstations.push(new PresserWorkstation(this));
        this.workstations.push(new SmokerWorkstation(this));
        this.workstations.push(new CauldronWorkstation(this));

        this.currentWorkstationIndex = 0;

        this.ui = new UI(this);
    }

    switchWorkstation(target: number) {
      if (this.ui.prompt || this.busy) return;
      if (this.currentWorkstation.currentlyDraggedObjects.length > 0) return;
      this.currentWorkstationIndex = target;
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
        if(isControlPressed(Controls.WORKSPACE_5)){
            this.switchWorkstation(4)
        }
        this.currentWorkstation.tick(dt);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentWorkstation.draw(ctx);
        this.currentWorkstation.clickableObjects.filter(co => co.isEnabled() && co.isHovering()).forEach(co => co.hover?.draw(ctx));
        this.ui.draw(ctx);
        this.lastTimestamp = timestamp
        window.requestAnimationFrame(this.run);
    }

    get currentWorkstation() {
      return this.workstations[this.currentWorkstationIndex];
    }

    nextWorkstation() { this.currentWorkstationIndex = (this.currentWorkstationIndex + 1) % this.workstations.length; }
    previousWorkstation() { this.currentWorkstationIndex = (this.workstations.length + this.currentWorkstationIndex - 1) % this.workstations.length; }

    resetCurrentRecipe() {
      this.currentRecipe = new Recipe();
    }

    setCurrentOrder(order: Order) {
      this.currentOrder = order;
    }
}
