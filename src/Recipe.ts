import Ingredient from './Ingredient.js';
import { chooseRandom, shuffle } from './util.js';
enum StirDirection {
  CLOCKWISE,
  COUNTERCLOCKWISE,
}

export default class Recipe {
  private ingredients: Array<Ingredient> = [];
  ingredientPositions: Array<IngredientPosition> = [];
  pressed = false;
  smoked = false;
  stirred : StirDirection | null = null;

  get smokedModifier() {
    if (!this.smoked || this.stirred === null) return '';
    if (this.stirred === StirDirection.CLOCKWISE) return 'ENKINDLED ';
    if (this.stirred === StirDirection.COUNTERCLOCKWISE) return 'SUPPRESSED ';
    return 'Invalid potion';
  }

  get pressedModifier() {
    if (!this.pressed || this.stirred === null) return '';
    if (this.stirred === StirDirection.CLOCKWISE) return 'COMPELLED ';
    if (this.stirred === StirDirection.COUNTERCLOCKWISE) return 'REPULSED ';
    return 'Invalid potion';
  }

  get ingredientsList() {
    if (this.ingredients.length === 0) return '';
    const ingredientNames = this.ingredients.map(i => i.name);
    if (ingredientNames.length === 1) return ingredientNames[0];
    const allButTheLast = ingredientNames.slice(0, -1).join(', ');
    return allButTheLast + " and " + ingredientNames.slice(-1)[0];
  }

  get effectsList() {
    // TODO make sure modifying ingredients are accounted for
    if (this.ingredients.length === 0) return '';
    const ingredientEffects = this.ingredients.map(i => i.description);
    if (ingredientEffects.length === 1) return ingredientEffects[0];
    const allButTheLast = ingredientEffects.slice(0, -1).join(', ');
    return allButTheLast + " and " + ingredientEffects.slice(-1)[0];
  }

  toString() {
    if (!this.stirred) return `Potion of ${this.smokedModifier}${this.pressedModifier}${this.effectsList}`;
    return this.ingredientsList;
  }

  positionsPerIngredient = 5;
  spreadX = 100;
  spreadY = 50;
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    for(let i = 0; i < this.positionsPerIngredient; i++) {
      this.ingredientPositions.push(new IngredientPosition(ingredient, Math.random() * this.spreadX, Math.random() * this.spreadY));
    }
    shuffle(this.ingredientPositions);
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.ingredientPositions.forEach(ip => ip.draw(ctx, x, y));
  }
}

class IngredientPosition {
  color: string;
  size = 25;
  constructor(readonly ingredient: Ingredient, readonly x: number, readonly y: number) {
    this.color = chooseRandom(ingredient.colors);
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = this.ingredient.colors[0];
    ctx.fillRect(this.x + x, this.y + y, this.size, this.size);
  }
}

export { StirDirection }
