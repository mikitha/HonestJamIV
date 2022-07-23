export default interface ClickableObject {
  draw(ctx: CanvasRenderingContext2D): void;
  isEnabled(): boolean;
  isHovering(): boolean;
  onClick(): void;
}
