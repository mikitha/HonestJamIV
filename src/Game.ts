export default class Game{
    mouseYPosition: number;

    constructor(readonly canvas: HTMLCanvasElement){

        this.mouseYPosition = 0
        window.addEventListener("mousemove", (event)=>{
           this.mouseYPosition = this.mouseYPosition + event.movementY
        })

        this.run = this.run.bind(this);
    }

    run(_timestamp: number){
        let ctx = this.canvas.getContext("2d")!;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCrank(ctx);
        window.requestAnimationFrame(this.run);
    }

    drawCrank(ctx: CanvasRenderingContext2D){
        ctx.fillRect(400, this.mouseYPosition, 200, 50);
    }
}