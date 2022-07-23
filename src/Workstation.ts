import ClickableObject from './ClickableObject.js';

interface Workstation {
  tick(dt: number): void,
  draw(ctx: CanvasRenderingContext2D): void,
  clickableObjects: Array<ClickableObject>,
}

export default Workstation;
