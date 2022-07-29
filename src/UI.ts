import Game from './Game.js';
import images from './images.js';
import Textbox from './Textbox.js';
import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';

export default class UI {
  clickableObjects: Array<ClickableObject> = [];

  trashcan: RectangularClickableObject;
  trashcanImage = images('ui/trashcan');

  leftArrow: NavigationArrow;
  rightArrow: NavigationArrow;

  prompt?: Prompt;

  leftTrashcanMargin = 10;
  bottomTrashcanMargin = 10;

  constructor(readonly game: Game) {
    const tci = this.trashcanImage;
    this.trashcan = new RectangularClickableObject(
      this,
      this.bottomTrashcanMargin,
      game.canvas.height - tci.height - this.leftTrashcanMargin,
      tci.width,
      tci.height,
      this.clickTrashcan.bind(this)
    );
    this.trashcan.isEnabled = () => !this.game.busy;

    this.leftArrow = new NavigationArrow(this, 20, 20, 144, 96, this.clickLeftArrow.bind(this), true);
    this.rightArrow = new NavigationArrow(this, 220, 20, 144, 96, this.clickRightArrow.bind(this), false);
  };

  clickLeftArrow() { this.game.nextWorkstation(); }
  clickRightArrow() { this.game.previousWorkstation(); }

  clickTrashcan() {
    if (this.prompt) return;
    this.prompt = new Prompt(
      this, 600, 200, "Throw away your current potion?", "Throw it out", "Keep it",
      () => { this.game.resetCurrentRecipe(); this.removePrompt()},
      () => { this.removePrompt() },
    );
  }

  removePrompt() {
    if (!this.prompt) return;
    const { confirmButton, cancelButton } = this.prompt;
    this.clickableObjects.splice(this.clickableObjects.indexOf(confirmButton), 1)
    this.clickableObjects.splice(this.clickableObjects.indexOf(cancelButton), 1)
    this.prompt = undefined;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawTrashcan(ctx);
    this.leftArrow.draw(ctx);
    this.rightArrow.draw(ctx);
    this.prompt?.draw(ctx);
    this.drawCurrentRecipe(ctx);
  }

  drawTrashcan(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.trashcanImage, this.trashcan.x, this.trashcan.y);
  }

  drawCurrentRecipe(ctx: CanvasRenderingContext2D) {
    const marginSides = 200;
    const marginBottom = 50;
    const height = 100;
    const recipe = this.game.currentRecipe;
    const canvas = this.game.canvas;
    if (recipe.ingredientsList.length < 1) return;
    const dimensions = [marginSides, canvas.height - marginBottom - height, canvas.width - (2 * marginSides), height] as const;
    ctx.strokeRect(...dimensions);

    ctx.fillStyle = "ghostwhite";
    ctx.fillRect(...dimensions);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(recipe.toString(), canvas.width / 2, canvas.height - marginBottom - (height / 2), dimensions[2]);
  }
}

class NavigationArrow extends RectangularClickableObject {
  enabled = true;
  constructor(readonly ui: UI, readonly x: number, readonly y: number, readonly w: number, readonly h: number, onClick: () => void, readonly isLeft: boolean) {
    super(ui, x, y, w, h, onClick);
  }
  draw(ctx: CanvasRenderingContext2D) {
    const img = images('ui/arrows')
    ctx.drawImage(img, this.isLeft ? 0 : this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
  }
}

class Prompt {
  textbox: Textbox;
  confirmButton: ClickableObject;
  cancelButton: ClickableObject;
  constructor(
    readonly ui: UI,
    readonly width: number,
    readonly height: number,
    readonly text: string,
    readonly confirmText: string,
    readonly cancelText: string,
    readonly onConfirm: () => void,
    readonly onCancel: () => void,
  ) {
    const { x, y } = this.topLeft();
    this.textbox = new Textbox(images('ui/textbox-2'), 16, 16, [x, y], [width, height], text);
    this.confirmButton = new PromptButton(
      ui, x + (1 * width / 8), y + (2 * height / 3), width / 4, height / 4, confirmText, onConfirm);
    this.cancelButton = new PromptButton(
      ui, x + (5 * width / 8), y + (2 * height / 3), width / 4, height / 4, cancelText, onCancel);
  }
  
  topLeft() {
    const canvas = this.ui.game.canvas;
    return { x: canvas.width / 2 - this.width / 2, y: canvas.height / 2 - this.height / 2 }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.textbox.draw(ctx);
    this.confirmButton.draw(ctx);
    this.cancelButton.draw(ctx);
  }
}

class PromptButton extends RectangularClickableObject {
  textbox: Textbox;
  hoverTextbox: Textbox;
  constructor (
    readonly ui: UI,
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
    readonly text: string,
    readonly onClick: () => void,
  ) {
      super(ui, x, y, width, height, onClick);
      this.textbox = new Textbox(images('ui/textbox-1a'), 10, 10, [x, y], [width, height], text);
      this.hoverTextbox = new Textbox(images('ui/textbox-1'), 10, 10, [x, y], [width, height], text);
  }

  isEnabled() { return true; }

  draw(ctx:CanvasRenderingContext2D) {
    this.isHovering() ? this.textbox.draw(ctx) : this.hoverTextbox.draw(ctx);
    return;
  }
}

