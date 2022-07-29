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
    this.game.busy = false;
    this.game.potionSold = false;
    this.clickableObjects = this.clickableObjects.filter(co => !(co instanceof Customer));
    if (this.customer) {
      this.customer = undefined;
    } else {
      this.customer = Customer.random(this);
    }
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
const INQUIRIES: Array<[string, string]> = [
  ["How is the ", " coming along?"],
  ["Please hurry up with the ", "."],
  ["You'll be able to make ", ", right?"],
];

class Customer extends RectangularClickableObject {
  enabled = true;
  messageDisplayed = false;
  greetingDisplayed = true;
  constructor(
    readonly ws: Workstation,
    readonly outfit: string,
    readonly skin: string,
    readonly greeting: [string, string],
    readonly inquiry: [string, string],
    readonly order: Order,
  ) {
    super(ws, 300, 200, 200, 400, () => {}); 
    this.onClick = this.displayMessage.bind(this);
  }
  displayMessage() {
    if (this.messageDisplayed) this.greetingDisplayed = false;
    if(this.order.isCorrect(this.game.currentRecipe)) this.game.sellPotion();
    this.messageDisplayed = !this.messageDisplayed;
  }
  shush() { this.greetingDisplayed = false; this.messageDisplayed = false; }
  draw(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = this.outfit;
    ctx.fillRect(300, 300, 200, 300);

    ctx.fillStyle = this.skin;
    ctx.beginPath();
    ctx.arc(400, 300 - 25, 75, 0, 2 * Math.PI);
    ctx.fill();

    if (!this.messageDisplayed) return;
    
    new Textbox(images('ui/textbox-0'), 64, 32, [100, 100], [448, 160], this.message).draw(ctx);
  }

  get message() {
    if (this.game.potionSold) {
      return "Thanks!";
    } else if (this.greetingDisplayed) {
      return this.greeting[0] + this.order.description + this.greeting[1];
    } else if (!this.game.currentRecipe.isComplete()) {
      return this.inquiry[0] + this.order.description + this.inquiry[1];
    } else  {
      return this.game.currentRecipe.hint(this.order.recipes[0]);
    }
  }

  static random(ws: Workstation) {
    return new Customer(ws, chooseRandom(OUTFIT_COLORS), chooseRandom(SKIN_COLORS), chooseRandom(GREETINGS), chooseRandom(INQUIRIES), Order.get());
  }
}
