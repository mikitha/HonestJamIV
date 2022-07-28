import ClickableObject from './ClickableObject.js';
import DraggableObject from './DraggableObject.js';
import Game from './Game.js';

interface Workstation {
  tick(dt: number): void,
  draw(ctx: CanvasRenderingContext2D): void,
  clickableObjects: Array<ClickableObject>,
  draggableObjects: Array<DraggableObject>,
  currentlyDraggedObjects: Array<DraggableObject>,
  game: Game,
}

export default Workstation;
