import Workstation from './Workstation.js';
import PresserWorkstation from './PresserWorkstation.js';
import IngredientsWorkstation from './IngredientsWorkstation.js';
import { isControlPressed, Controls } from './keyboardInput.js';
import ClickableObject from './ClickableObject.js';

export default class Game {
    mouseXPosition: number;
    mouseYPosition: number;

    clickableObjects: Array<ClickableObject>;

    workstations: Array<Workstation>;
    currentWorkstation: Workstation;

    constructor(readonly canvas: HTMLCanvasElement){
        this.mouseXPosition = 0
        this.mouseYPosition = 0
        window.addEventListener("mousemove", (event)=>{
           this.mouseXPosition = this.mouseXPosition + event.movementX
           this.mouseYPosition = this.mouseYPosition + event.movementY
        })

        window.addEventListener('click', _ev => {
          this.clickableObjects.filter(co => co.isHovering() && co.isEnabled()).forEach(co => co.onClick());
        });

        this.run = this.run.bind(this);

        this.clickableObjects = [];

        this.workstations = [];
        this.workstations.push(new IngredientsWorkstation(this));
        this.workstations.push(new PresserWorkstation(this));

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
        this.currentWorkstation.tick(0);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentWorkstation.draw(ctx);
        window.requestAnimationFrame(this.run);
    }

}
