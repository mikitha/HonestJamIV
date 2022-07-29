import Game from './Game.js';
import Workstation from './Workstation.js';

import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';
import DraggableObject from './DraggableObject.js';

import images from './images.js';
import Textbox from './Textbox.js';
import Order from './Order.js';

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

  reset() {
  }

  tick(_dt: number) {
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.clickableObjects.forEach(co => co.draw(ctx));
    this.customer?.draw(ctx);
  }

  summonCustomer() {
    this.clickableObjects = this.clickableObjects.filter(co => !(co instanceof Customer));
    this.customer = Customer.random(this);
  }

  get order() {
    return this.customer?.order;
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

const GREETINGS: Array<[string, string]> = [
  ["Hello! Could you make me ", "?"],
  ["Greetings, I'm looking for ", "."],
  ["I need ", ", if you don't mind!"],
];

class Customer extends RectangularClickableObject {
  enabled = true;
  messageDisplayed = false;
  constructor(readonly ws: Workstation, readonly outfit: string, readonly skin: string, readonly greeting: [string, string], readonly order: Order) {
    super(ws, 300, 200, 200, 400, () => {}); 
    this.onClick = this.displayMessage.bind(this);
  }
  displayMessage() { this.messageDisplayed = !this.messageDisplayed; }
  draw(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = this.outfit;
    ctx.fillRect(300, 300, 200, 300);

    ctx.fillStyle = this.skin;
    ctx.beginPath();
    ctx.arc(400, 300 - 25, 75, 0, 2 * Math.PI);
    ctx.fill();

    if (!this.messageDisplayed) return;
    const message = this.greeting[0] + this.order.description + this.greeting[1];
    new Textbox(images('ui/textbox-0'), 64, 32, [100, 100], [448, 160], message).draw(ctx);
  }

  static random(ws: Workstation) {
    return new Customer(ws, chooseRandom(OUTFIT_COLORS), chooseRandom(SKIN_COLORS), chooseRandom(GREETINGS), Order.get());
  }
}
