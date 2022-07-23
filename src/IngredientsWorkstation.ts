import Workstation from './Workstation.js';
import Game from './Game.js';

import ClickableObject from './ClickableObject.js';

import Ingredient, { ingredients } from './Ingredient.js';

export default class IngredientsWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  constructor(readonly game: Game) {
    this.createIngredientHolder(200, 200, ingredients.marigold);
    this.createIngredientHolder(320, 200, ingredients.sunflower);
    this.createIngredientHolder(440, 200, ingredients.lilac);
    this.createIngredientHolder(560, 200, ingredients.rose);
    this.createIngredientHolder(200, 360, ingredients.sage);
    this.createIngredientHolder(320, 360, ingredients.willow);
    this.createIngredientHolder(440, 360, ingredients.dogwood);
    this.createIngredientHolder(560, 360, ingredients.bluebell);
    this.createIngredientHolder(200, 520, ingredients.lemonBalm);
    this.createIngredientHolder(320, 520, ingredients.lavender);
  }

  createIngredientHolder(x: number, y: number, ing: Ingredient) {
    const ih = new IngredientHolder(this.game, x, y, ing);
    this.clickableObjects.push(ih.closedDoor);
    this.clickableObjects.push(ih.openedDoor);
    this.clickableObjects.push(ih.ingredientPile);
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
    public ing: Ingredient,
    readonly onClick: () => void,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isHovering() ? "khaki" : "brown";
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
    ctx.fillStyle = this.ing.colors[0];
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class IngredientHolder {
  closedDoor: IngredientDoor;
  openedDoor: IngredientDoor;
  ingredientPile: IngredientPile;

  constructor(
    readonly game: Game,
    public x: number,
    public y: number,
    public ingredient: Ingredient,
  ) {
    this.openDoor = this.openDoor.bind(this);
    this.closeDoor = this.closeDoor.bind(this);
    this.gatherIngredient = this.gatherIngredient.bind(this);

    this.closedDoor = new IngredientDoor(this.game, this.x, this.y, 100, 140, ingredient, this.openDoor);
    this.openedDoor = new IngredientDoor(this.game, this.x, this.y, 100, 20, ingredient, this.closeDoor);
    this.ingredientPile = new IngredientPile(this.game, this.x + 20, this.y + 50, 60, 80, ingredient, this.gatherIngredient);
  }

  openDoor() {
    this.closedDoor.enabled = false;
    this.openedDoor.enabled = true;
    this.ingredientPile.enabled = true;
  }

  closeDoor() {
    this.closedDoor.enabled = true;
    this.openedDoor.enabled = false;
    this.ingredientPile.enabled = false;
  }

  gatherIngredient() {
    this.game.currentRecipe.ingredients.push(this.ingredient);
    console.log(this.game.currentRecipe.toString());
    console.log(this.game.currentRecipe.ingredientsList);
  }
}

