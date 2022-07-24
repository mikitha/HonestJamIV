export default interface DraggableObject {
  onMouseDown(): void,
  onMouseUp(): void,
  isHovering(): boolean,
  isEnabled(): boolean,
}
