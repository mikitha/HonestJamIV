import Workstation from './Workstation.js';
import Game from './Game.js';

import ClickableObject from './ClickableObject.js'

export default class IngredientsWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  constructor(readonly game: Game) {
    this.createIngredientHolder(200, 200, "yellow", "banana");
    this.createIngredientHolder(320, 200, "green", "mustard");
  }

  createIngredientHolder(x: number, y: number, color: string, name: string) {
    const ih = new IngredientHolder(this.game, x, y, color, name);
    this.clickableObjects.push(ih.closedDoor);
    this.clickableObjects.push(ih.openedDoor);
    this.clickableObjects.push(ih.ingredient);
    ih.closeDoor();
  }

  tick(_dt: number) {
    //this.clickableObjects.forEach(co => co.tick(_dt));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "30pt sans-serif";
    ctx.fillStyle = "blue";
    ctx.fillText('Ingredients', 200, 100);

    this.clickableObjects.filter(co => co.isEnabled()).forEach(co => co.draw(ctx));
  }
}

class IngredientDoor implements ClickableObject {
  enabled = false;

  constructor(
    readonly game: Game,
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    readonly onClick: () => void,
  ) {
    this.game.clickableObjects.push(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isHovering() ? "blue" : "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  isHovering() {
    const { mouseXPosition, mouseYPosition } = this.game;
    const { x, y, w, h } = this;
    const mx = mouseXPosition;
    const my = mouseYPosition;
    return (
      mx >= x &&
      mx < x + w &&
      my >= y &&
      my < y + h
    );
  }

  isEnabled() { return this.enabled; }
}

class IngredientPile extends IngredientDoor {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isHovering() ? "orange" : "green";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class IngredientHolder {
  closedDoor: IngredientDoor;
  openedDoor: IngredientDoor;
  ingredient: IngredientPile;

  constructor(
    readonly game: Game,
    public x: number,
    public y: number,
    public color: string,
    public ingredientName: string,
  ) {
    this.openDoor = this.openDoor.bind(this);
    this.closeDoor = this.closeDoor.bind(this);
    this.gatherIngredient = this.gatherIngredient.bind(this);

    this.closedDoor = new IngredientDoor(this.game, this.x, this.y, 100, 140, this.openDoor);
    this.openedDoor = new IngredientDoor(this.game, this.x, this.y, 100, 20, this.closeDoor);
    this.ingredient = new IngredientPile(this.game, this.x + 20, this.y + 50, 60, 80, this.gatherIngredient);
  }

  openDoor() {
    this.closedDoor.enabled = false;
    this.openedDoor.enabled = true;
    this.ingredient.enabled = true;
  }

  closeDoor() {
    this.closedDoor.enabled = true;
    this.openedDoor.enabled = false;
    this.ingredient.enabled = false;
  }

  gatherIngredient() {
    console.log(`Gathered ${this.ingredientName}`);
  }
}

