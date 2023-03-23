import * as PIXI from 'pixi.js';
import { StaticGraphics } from '@/lib/pixi-tools-v2/class/staticGraphics';
import { ElementOptions } from '@/lib/pixi-tools-v2/types/pixi-enums';

export class Rectangle { // Extends StaticsGraphics à l'avenir
    graphics: PIXI.Graphics;

    constructor(private x: number, private y: number, private width: number, private height: number, private color: number) {
      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(color);
      this.graphics.drawRect(x, y, width, height);
      this.graphics.endFill();
    }
  
    public addToStage(stage: PIXI.Container): void {
      stage.addChild(this.graphics);
    }
  
    public removeFromStage(stage: PIXI.Container): void {
      stage.removeChild(this.graphics);
    }
  
    public setPosition(x: number, y: number): void {
      this.graphics.position.set(x, y);
    }
  
    public setWidth(width: number): void {
      this.graphics.width = width;
    }
  
    public setHeight(height: number): void {
      this.graphics.height = height;
    }
  
    public setFillColor(color: number): void {
      this.graphics.tint = color;
    }
}
