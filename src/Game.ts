import Workstation from './Workstation.js';
import PresserWorkstation from './PresserWorkstation.js';
import IngredientsWorkstation from './IngredientsWorkstation.js';
import { isControlPressed, Controls } from './keyboardInput.js';

export default class Game {
    mouseYPosition: number;

    workstations: Array<Workstation>;
    currentWorkstation: Workstation;

    constructor(readonly canvas: HTMLCanvasElement){
        this.mouseYPosition = 0
        window.addEventListener("mousemove", (event)=>{
           this.mouseYPosition = this.mouseYPosition + event.movementY
        })

        this.run = this.run.bind(this);

        this.workstations = [];
        this.workstations.push(new IngredientsWorkstation(this));
        this.workstations.push(new PresserWorkstation(this));

        this.currentWorkstation = this.workstations[0];
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
