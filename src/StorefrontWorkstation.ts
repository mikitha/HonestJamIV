import Game from './Game.js';
import Workstation from './Workstation.js';

import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';
import DraggableObject from './DraggableObject.js';

import { chooseRandom } from './util.js';

export default class StorefrontWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  draggableObjects: Array<DraggableObject> = [];
  currentlyDraggedObjects: Array<DraggableObject> = [];
  customer?: Customer = undefined;
  frontDoor: FrontDoor;

  constructor(readonly game: Game) {
    this.frontDoor = new FrontDoor(this, 600, 200, 200, 300, this.summonCustomer.bind(this));
  }

  tick(_dt: number) {
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.clickableObjects.forEach(co => co.draw(ctx));
    this.customer?.draw(ctx);
  }

  summonCustomer() {
    this.customer = Customer.random();
  }
}

class FrontDoor extends RectangularClickableObject {
  enabled = true;
}

const OUTFIT_COLORS = [
  "purple",
  "red",
  "green",
  "blue",
  "lightgrey",
];

const SKIN_COLORS = [
  "bisque",
  "cornsilk",
  "goldenrod",
  "khaki",
  "linen",
  "mistyrose",
  "peru",
  "sienna",
  "chocolate",
];

class Customer {
  constructor(readonly outfit: string, readonly skin: string) {}
  draw(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = this.outfit;
    ctx.fillRect(300, 300, 200, 300);

    ctx.fillStyle = this.skin;
    ctx.beginPath();
    ctx.arc(400, 300 - 25, 75, 0, 2 * Math.PI);
    ctx.fill();
  }

  static random() {
    return new Customer(chooseRandom(OUTFIT_COLORS), chooseRandom(SKIN_COLORS));
  }
}
