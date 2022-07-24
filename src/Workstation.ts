import ClickableObject from './ClickableObject.js';
import Game from './Game.js';

interface Workstation {
  tick(dt: number): void,
  draw(ctx: CanvasRenderingContext2D): void,
  clickableObjects: Array<ClickableObject>,
  game: Game;
}

export default Workstation;
