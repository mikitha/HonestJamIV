import Workstation from './Workstation.js';
import Game from './Game.js';
import Hover from './Hover.js';

import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';

import Ingredient, { ingredients } from './Ingredient.js';

import { chooseRandom, lerp } from './util.js';

export default class IngredientsWorkstation implements Workstation {
  clickableObjects: Array<ClickableObject> = [];
  draggableObjects = [];
  currentlyDraggedObjects = [];

  ingredientTrails: Array<IngredientTrail> = [];
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
    const ih = new IngredientHolder(this, x, y, ing);
    ih.closeDoor();
  }

  tick(dt: number) {
    //this.clickableObjects.forEach(co => co.tick(_dt));
    this.ingredientTrails.forEach(it => it.tick(dt));
    this.ingredientTrails = this.ingredientTrails.filter(it => it.enabled);
    this.game.busy = !!this.ingredientTrails.length;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "30pt sans-serif";
    ctx.fillStyle = "blue";
    ctx.fillText('Ingredients', 200, 100);

    this.clickableObjects.filter(co => co.isEnabled()).forEach(co => co.draw(ctx));
    this.game.currentRecipe.draw(ctx, 700, 500);

    this.ingredientTrails.forEach(it => it.draw(ctx));
  }
}

class IngredientDoor extends RectangularClickableObject {
  constructor(
    readonly workstation: Workstation,
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    public ing: Ingredient,
    readonly onClick: () => void,
  ) {
    super(workstation, x, y, w, h, onClick);
    this.hover = new Hover(workstation.game, ing.description);
  }
}

class IngredientPile extends IngredientDoor {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.ing.colors[0];
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class IngredientHolder {
  game: Game;
  closedDoor: IngredientDoor;
  openedDoor: IngredientDoor;
  ingredientPile: IngredientPile;

  constructor(
    readonly workstation: IngredientsWorkstation,
    public x: number,
    public y: number,
    public ingredient: Ingredient,
  ) {
    this.game = this.workstation.game;

    this.openDoor = this.openDoor.bind(this);
    this.closeDoor = this.closeDoor.bind(this);
    this.gatherIngredient = this.gatherIngredient.bind(this);

    this.closedDoor = new IngredientDoor(workstation, this.x, this.y, 100, 140, ingredient, this.openDoor);
    this.openedDoor = new IngredientDoor(workstation, this.x, this.y, 100, 20, ingredient, this.closeDoor);
    this.ingredientPile = new IngredientPile(workstation, this.x + 20, this.y + 50, 60, 80, ingredient, this.gatherIngredient);
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
    this.game.currentRecipe.addIngredient(this.ingredient);

    const ip = this.ingredientPile;
    const it = new IngredientTrail(ip.x + (ip.w / 2), 800, ip.y + (ip.h / 2), 550, this.ingredient);
    this.workstation.ingredientTrails.push(it);
  }
}

class IngredientTrail {
  progress = 0;
  speed = 0.0015;
  enabled = true;
  x: number;
  y: number;
  particles: Array<IngredientTrailParticle> = [];
  constructor(
    readonly startX: number,
    readonly endX: number,
    readonly startY: number,
    readonly endY: number,
    readonly ingredient: Ingredient,
  ) {
    this.x = startX;
    this.y = startY;
  }

  tick(dt: number) {
    if (!this.enabled) return;
    this.progress += dt * this.speed;
    this.x = lerp(this.startX, this.endX, this.progress);
    this.y = lerp(this.startY, this.endY, this.progress);

    this.particles.push(new IngredientTrailParticle(this.x, this.y, this.ingredient));
    this.particles.forEach(p => p.tick(dt));
    this.particles = this.particles.filter(p => p.enabled);

    if (this.progress > 1) {
      this.progress = 1;
      this.enabled = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.enabled) return;
    this.particles.forEach(p => p.draw(ctx));
  }
}

class IngredientTrailParticle {
  direction: number;
  enabled = true;
  speed = 0.15;
  constructor(
    private x: number,
    private y: number,
    readonly ingredient: Ingredient,
    private duration: number = 150,
  ) {
    this.direction = Math.random() * Math.PI * 2;
  }

  draw(ctx:CanvasRenderingContext2D) {
    if (!this.enabled) return;
    ctx.fillStyle = chooseRandom(this.ingredient.colors);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  tick(dt: number) {
    if (!this.enabled) return;
    this.duration -= dt;
    this.x += Math.cos(this.direction * dt) * this.speed * dt;
    this.y += Math.sin(this.direction) * this.speed * dt;
    if (this.duration < 0) {
      this.duration = 0;
      this.enabled = false;
    }
  }

}
