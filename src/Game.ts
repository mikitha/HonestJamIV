import Workstation from './Workstation.js';
import PresserWorkstation from './PresserWorkstation.js';
import IngredientsWorkstation from './IngredientsWorkstation.js';
import CauldronWorkstation from './CauldronWorkstation.js';
import { isControlPressed, Controls } from './keyboardInput.js';
import Recipe from './Recipe.js';

export default class Game {
    mouseXPosition: number;
    mouseYPosition: number;

    workstations: Array<Workstation>;
    currentWorkstation: Workstation;

    currentRecipe: Recipe;

    constructor(readonly canvas: HTMLCanvasElement){
        this.mouseXPosition = 0
        this.mouseYPosition = 0
        window.addEventListener("mousemove", event =>{
           this.mouseXPosition = event.clientX;
           this.mouseYPosition = event.clientY;
        })

        window.addEventListener('click', _ev => {
          this.currentWorkstation.clickableObjects.filter(co => co.isHovering() && co.isEnabled()).forEach(co => co.onClick());
        });

        this.run = this.run.bind(this);

        this.currentRecipe = new Recipe();

        this.workstations = [];
        this.workstations.push(new IngredientsWorkstation(this));
        this.workstations.push(new PresserWorkstation(this));
        this.workstations.push(new CauldronWorkstation(this));

        this.currentWorkstation = this.workstations[1];
    }

    run(_timestamp: number){
        let ctx = this.canvas.getContext("2d")!;
        if (isControlPressed(Controls.WORKSPACE_1)) {
          this.currentWorkstation = this.workstations[0]
        }
        if (isControlPressed(Controls.WORKSPACE_2)) {
          this.currentWorkstation = this.workstations[1]
        }
        if (isControlPressed(Controls.WORKSPACE_3)) {
          this.currentWorkstation = this.workstations[2]
        }
        this.currentWorkstation.tick(0);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentWorkstation.draw(ctx);
        window.requestAnimationFrame(this.run);
    }

}
