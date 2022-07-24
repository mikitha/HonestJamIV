import Game from './Game.js';
import images from './images.js';

import ClickableObject, { RectangularClickableObject } from './ClickableObject.js';

export default class UI {
  trashcan: RectangularClickableObject;
  trashcanImage = images('ui/trashcan');
  clickableObjects: Array<ClickableObject> = [];

  prompt?: Prompt;

  leftMargin = 10;
  bottomMargin = 10;

  constructor(readonly game: Game) {
    const tci = this.trashcanImage;
    this.trashcan = new RectangularClickableObject(
      this,
      this.bottomMargin,
      game.canvas.height - tci.height - this.leftMargin,
      tci.width,
      tci.height,
      this.clickTrashcan.bind(this)
    );
    this.trashcan.isEnabled = () => true;
  };

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
    this.prompt?.draw(ctx);
  }

  drawTrashcan(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.trashcanImage, this.trashcan.x, this.trashcan.y);
  }
}

class Prompt {
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
    const { x, y } = this.topLeft();
    ctx.strokeRect(x, y, this.width, this.height);
    ctx.textAlign = 'center';
    ctx.font = "40pt sans-serif";
    ctx.fillStyle = "black";
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.text, x + this.width / 2, y + this.height / 3, this.width);
    this.confirmButton.draw(ctx);
    this.cancelButton.draw(ctx);
  }
}

class PromptButton extends RectangularClickableObject {
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
  }

  isEnabled() { return true; }

  draw(ctx:CanvasRenderingContext2D) {
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.isHovering() ? "blue" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = this.isHovering() ? "white" : "blue";
    ctx.font = '30pt sans-serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height, this.width);
  }
}

