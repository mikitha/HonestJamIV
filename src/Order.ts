import Recipe from './Recipe.js';

export default class Order {
  constructor (readonly description: string, readonly recipes: Array<Recipe>) {}

  hint(_recipe: Recipe) {
    return "I have no hints for you";
  }

  isCorrect(recipe: Recipe) {
    return !!this.recipes.find(r => r.equals(recipe));
  }
}
