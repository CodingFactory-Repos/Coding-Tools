import { Graphics, Rectangle } from 'pixi.js';
import { ElementOptions, ResizeGraphic } from '../types';

export class TransformBox {
	public readonly top: ResizeGraphic;
	public readonly bottom: ResizeGraphic;
	public readonly left: ResizeGraphic;
	public readonly right: ResizeGraphic;

	public readonly topLeft: ResizeGraphic;
	public readonly topRight: ResizeGraphic;
	public readonly botLeft: ResizeGraphic;
	public readonly botRight: ResizeGraphic;

	public readonly graphic: Graphics;
	public readonly rectSize: number;
	public readonly hitAreaMargin: number;

	constructor(options: ElementOptions.TransformBoxProperties) {
		const { scale, width, height, positionX, positionY, rectSize } = options;

		this.graphic = new Graphics();
		this.rectSize = rectSize || 10;
		this.hitAreaMargin = 10;

		const lineWidth = 2 / scale;
		const newRectSize = this.rectSize / scale;
		const hitAreaMargin = this.hitAreaMargin;

		this.top = new ResizeGraphic();
		this.top.beginFill(0x0c8ce9);
		this.top.drawRect(positionX, positionY, width, 1);
		this.top.endFill();
		this.top.hitArea = new Rectangle(
			positionX - hitAreaMargin,
			positionY - hitAreaMargin,
			width + hitAreaMargin * 2,
			hitAreaMargin * 2,
		);

		this.bottom = new ResizeGraphic();
		this.bottom.beginFill(0x0c8ce9);
		this.bottom.drawRect(positionX, positionY + height - 1, width, lineWidth);
		this.bottom.endFill();
		this.bottom.hitArea = new Rectangle(
			positionX - hitAreaMargin,
			positionY + height - hitAreaMargin,
			width + hitAreaMargin * 2,
			hitAreaMargin * 2,
		);

		this.left = new ResizeGraphic();
		this.left.beginFill(0x0c8ce9);
		this.left.drawRect(positionX, positionY, 1, height);
		this.left.endFill();
		this.left.hitArea = new Rectangle(
			positionX - hitAreaMargin,
			positionY - hitAreaMargin,
			hitAreaMargin * 2,
			height + hitAreaMargin * 2,
		);

		this.right = new ResizeGraphic();
		this.right.beginFill(0x0c8ce9);
		this.right.drawRect(positionX + width - 1, positionY, 1, height);
		this.right.endFill();
		this.right.hitArea = new Rectangle(
			positionX + width - hitAreaMargin,
			positionY - hitAreaMargin,
			hitAreaMargin * 2,
			height + hitAreaMargin * 2,
		);

		this.topLeft = new ResizeGraphic();
		this.topLeft.beginFill(0xffffff);
		this.topLeft.lineStyle(lineWidth, 0x0c8ce9, 1);
		this.topLeft.drawRect(0, 0, newRectSize, newRectSize);
		this.topLeft.endFill();
		this.topLeft.x = positionX - newRectSize / 2;
		this.topLeft.y = positionY - newRectSize / 2;

		this.topRight = new ResizeGraphic();
		this.topRight.beginFill(0xffffff);
		this.topRight.lineStyle(lineWidth, 0x0c8ce9, 1);
		this.topRight.drawRect(0, 0, newRectSize, newRectSize);
		this.topRight.endFill();
		this.topRight.x = positionX + width - newRectSize / 2;
		this.topRight.y = positionY - newRectSize / 2;

		this.botLeft = new ResizeGraphic();
		this.botLeft.beginFill(0xffffff);
		this.botLeft.lineStyle(lineWidth, 0x0c8ce9, 1);
		this.botLeft.drawRect(0, 0, newRectSize, newRectSize);
		this.botLeft.endFill();
		this.botLeft.x = positionX - newRectSize / 2;
		this.botLeft.y = positionY + height - newRectSize / 2;

		this.botRight = new ResizeGraphic();
		this.botRight.beginFill(0xffffff);
		this.botRight.lineStyle(lineWidth, 0x0c8ce9, 1);
		this.botRight.drawRect(0, 0, newRectSize, newRectSize);
		this.botRight.endFill();
		this.botRight.x = positionX + width - newRectSize / 2;
		this.botRight.y = positionY + height - newRectSize / 2;

		this.top.interactive = true;
		this.bottom.interactive = true;
		this.left.interactive = true;
		this.right.interactive = true;
		this.topLeft.interactive = true;
		this.topRight.interactive = true;
		this.botLeft.interactive = true;
		this.botRight.interactive = true;
		this.graphic.visible = false;

		this.top.cursor = 'ns-resize';
		this.bottom.cursor = 'ns-resize';
		this.left.cursor = 'ew-resize';
		this.right.cursor = 'ew-resize';
		this.topLeft.cursor = 'nwse-resize';
		this.topRight.cursor = 'nesw-resize';
		this.botLeft.cursor = 'nesw-resize';
		this.botRight.cursor = 'nwse-resize';

		this.top.id = 'TOP';
		this.bottom.id = 'BOTTOM';
		this.left.id = 'LEFT';
		this.right.id = 'RIGHT';
		this.topLeft.id = 'TOPLEFT';
		this.topRight.id = 'TOPRIGHT';
		this.botLeft.id = 'BOTTOMLEFT';
		this.botRight.id = 'BOTTOMRIGHT';

		this.graphic.addChild(this.top);
		this.graphic.addChild(this.bottom);
		this.graphic.addChild(this.left);
		this.graphic.addChild(this.right);
		this.graphic.addChild(this.topLeft);
		this.graphic.addChild(this.topRight);
		this.graphic.addChild(this.botLeft);
		this.graphic.addChild(this.botRight);
	}
}
