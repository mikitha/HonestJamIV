export default class Textbox {
  constructor(
    readonly boxImage: HTMLImageElement,
    readonly boxEdgeWidth: number,
    readonly boxEdgeHeight: number,
    readonly position: [number, number],
    readonly size: [number, number],
    readonly text: string
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    const [x, y] = this.position;
    const [w, h] = this.size;
    // TODO maybe modify w and h to be multiples of boxEdge measurements
    
    const cornerWidth = (this.boxImage.width - this.boxEdgeWidth) / 2;
    const cornerHeight = (this.boxImage.height - this.boxEdgeHeight) / 2;
    //top left
    ctx.drawImage(this.boxImage, 0, 0, cornerWidth, cornerHeight, x, y, cornerWidth, cornerHeight);

    //top right
    ctx.drawImage(this.boxImage, this.boxImage.width - cornerWidth, 0, cornerWidth, cornerHeight, x + w - cornerWidth, y, cornerWidth, cornerHeight);
    
    //bottom left
    ctx.drawImage(this.boxImage, 0, this.boxImage.height - cornerHeight, cornerWidth, cornerHeight, x, y + h - cornerHeight, cornerWidth, cornerHeight);

    //bottom right
    ctx.drawImage(this.boxImage, this.boxImage.width - cornerWidth, this.boxImage.height - cornerHeight, cornerWidth, cornerHeight, x + w - cornerWidth, y + h - cornerHeight, cornerWidth, cornerHeight);

    //top and bottom edge
    for(let i = cornerWidth; i < w - cornerWidth; i += this.boxEdgeWidth) {
      ctx.drawImage(this.boxImage, cornerWidth, 0, this.boxEdgeWidth, cornerHeight, i + x, y, this.boxEdgeWidth, cornerHeight);
      ctx.drawImage(this.boxImage, cornerWidth, this.boxImage.height - cornerHeight, this.boxEdgeWidth, cornerHeight, i + x, y + h - cornerHeight, this.boxEdgeWidth, cornerHeight);
    }

    //left and right edge
    const vertBorderHeight = this.boxImage.height - (2 * this.boxEdgeHeight);
    for(let i = this.boxEdgeHeight; i < h - this.boxEdgeHeight; i += vertBorderHeight) {
      ctx.drawImage(this.boxImage, 0, cornerHeight, cornerWidth, this.boxEdgeHeight, x, i + y, cornerWidth, this.boxEdgeHeight);
      ctx.drawImage(this.boxImage, this.boxImage.width - cornerWidth, cornerHeight, cornerWidth, this.boxEdgeHeight, x + w - cornerWidth, i + y, cornerWidth, this.boxEdgeHeight);
    }

    const centerWidth = this.boxImage.width - (2 * cornerWidth);
    const centerHeight = this.boxImage.height - (2 * cornerHeight);
    for (let i = cornerWidth; i < w - cornerWidth; i += centerWidth) {
      for (let j = cornerHeight; j < h - cornerHeight; j += centerHeight) {
        ctx.drawImage(this.boxImage, cornerWidth, cornerHeight, centerWidth, centerHeight, i + x, j + y, centerWidth, centerHeight);
      }
    }

    const fontHeight = 16;
    ctx.font = `${fontHeight}px monospace`;
    ctx.fillStyle = "black";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    let pieces = 1;
    while(split(this.text, pieces).filter(line => ctx.measureText(line).width > w - (2 * cornerWidth)).length) pieces++;
    const splitText = split(this.text, pieces);
    for (let i = 0; i < pieces; i++) {
      ctx.fillText(splitText[i], x + cornerWidth, y + cornerHeight + (fontHeight * i));
    }
  }
}

function split(text: string, pieces: number) {
  const arr = [];
  const words = text.split(' ');
  for (let i = 0; i < pieces; i++) {
    arr.push(words.slice(Math.ceil(i * (words.length / pieces)), Math.ceil((i + 1) * (words.length / pieces))));
  }
  return arr.map(line => line.join(' ')).flat(1);
}
