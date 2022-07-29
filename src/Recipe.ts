import Ingredient from './Ingredient.js';
import { chooseRandom, shuffle } from './util.js';
import images from './images.js';

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

  equals(other: Recipe) {
    if (this.ingredients.length != other.ingredients.length) return false;
    for(let i = 0; i < this.ingredients.length; i++) {
      if (!this.ingredients.includes(other.ingredients[i])) return false;
    }
    if (this.pressed !== other.pressed) return false;
    if (this.smoked !== other.smoked) return false;
    if (this.stirred !== other.stirred) return false;
    return true;
  }

  hint(target: Recipe) {
    if(this.stirred !== target.stirred || this.pressed !== target.pressed || this.smoked !== target.smoked) {
      return `should be ${target.smokedModifier}${target.pressedModifier}`;
    }
    for (let i = 0; i < this.ingredients.length; i++) {
      if (!target.ingredients.includes(this.ingredients[i])) {
        return `should not include ${this.ingredients[i].name}`;
      }
    }
    for (let i = 0; i < target.ingredients.length; i++) {
      if (!this.ingredients.includes(target.ingredients[i])) {
        return `should include ${target.ingredients[i].name}`;
      }
    }
    return `is correct`;
  }

  isComplete() {
    return this.stirred !== null;
  }

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
    return `Potion of ${this.smokedModifier}${this.pressedModifier}${this.effectsList}
${this.pressed && this.stirred == undefined ? ", pressed" : ""}${this.smoked && this.stirred == undefined ? ", smoked" : ""}`;
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

function splitColor(color: string): [number, number, number] {
  const red = parseInt(color.slice(1, 3), 16) / 255;
  const green = parseInt(color.slice(3, 5), 16) / 255;
  const blue = parseInt(color.slice(5, 7), 16) / 255;
  return [red, green, blue];
}

const potionImages: {[key in string]: HTMLImageElement} = {};
function potionImage(color: string, potionImageName: string, bottleImageName: string): HTMLImageElement {
  if (potionImages[color]) return potionImages[color];
  const time = new Date().getMilliseconds();
  const source = images(potionImageName);
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source,0,0, canvas.width, canvas.width);
  const whiteImageData = ctx.getImageData(0,0,canvas.width,canvas.width);
  const colorImageData = ctx.createImageData(whiteImageData);
  const [r, g, b] = splitColor(color);
  for (let i = 0; i < whiteImageData.data.length; i+= 4) {
    colorImageData.data[i] = whiteImageData.data[i] * r;
    colorImageData.data[i+1] = whiteImageData.data[i+1] * g;
    colorImageData.data[i+2] = whiteImageData.data[i+2] * b;
    colorImageData.data[i+3] = whiteImageData.data[i+3];
  }
  console.log(`Generated ${color}/${potionImageName}/${bottleImageName} in ${new Date().getMilliseconds() - time}ms`);
  ctx.putImageData(colorImageData, 0, 0)
  ctx.drawImage(images(bottleImageName), 0, 0);
  const img = new Image();
  img.src = canvas.toDataURL();
  potionImages[color] = img;
  return img;
}

export { StirDirection, potionImage }
