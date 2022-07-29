import Recipe, { StirDirection } from './Recipe.js';

import { ingredients } from './Ingredient.js';

export default class Order {
  constructor (readonly description: string, readonly recipes: Array<Recipe>) {}

  hint(_recipe: Recipe) {
    return "I have no hints for you";
  }

  isCorrect(recipe: Recipe) {
    return !!this.recipes.find(r => r.equals(recipe));
  }

  static get() {
    const r = new Recipe();
    r.addIngredient(ingredients.marigold);
    r.addIngredient(ingredients.sunflower);
    r.smoked = true;
    r.stirred = StirDirection.CLOCKWISE;
    return new Order("a potion that will bring me confidence", [r]);
  }
}
