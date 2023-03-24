import { Scene } from '@/lib/pixi-tools/scene';
import { Graphics, Container, Text } from 'pixi.js';


export default function (scene: Scene, templateOptions: number) {
	const container = new Container();
	const graphics = new Graphics();
	const line = new Graphics();
	const lineTwo = new Graphics();
	const WIDTH = scene.viewport.screenWidth;
	const HEIGHT = scene.viewport.screenHeight;

	const originWidth = 200;
	const originHeigh = 200;
	const scale = scene.viewport.scale.x;
	// scene.viewport.screenWidth TODO: center object
	const canvasX =  50;
	const canvasY = 100;
	console.log("bonjour", templateOptions);



	const centerX = canvasX;
	const centerY = canvasY;
	graphics.beginFill(0xfff322);
	graphics.drawRect(0, 0, WIDTH, HEIGHT);
	graphics.endFill();

	container.addChild(graphics);
	container.addChild(line);
	container.addChild(lineTwo);

	line.position.set((WIDTH / 3 )* 1, 0);
	lineTwo.position.set((WIDTH / 3 )* 2, 0)

// Draw the line (endPoint should be relative to myGraph's position)
	line.lineStyle(2, 0x000000)
		.moveTo(0, 0)
		.lineTo(0, HEIGHT);
	lineTwo.lineStyle(2, 0x000000)
	.moveTo(0, 0)
	.lineTo(0, HEIGHT);
	const textOne = new Text(templateOptions === 1 ? "Mad": "Liked", {
		fontFamily: "Arial",
		fontSize: 20,
		fill: 0x000000,
		wordWrap: true,
		wordWrapWidth: scene.viewport.screenWidth
	});
	textOne.x = (WIDTH/3) * 0.5 ;
	textOne.y = 50;
	container.addChild(textOne);
	const textTwo = new Text(templateOptions === 1 ? "Sad": "Learned", {
		fontFamily: "Arial",
		fontSize: 20,
		fill: 0x000000,
		wordWrap: true,
		wordWrapWidth: scene.viewport.screenWidth
	});
	textTwo.x = WIDTH/2;
	textTwo.y = 50;
	container.addChild(textTwo);
	const textThree = new Text(templateOptions === 1 ? "Glad": "Lacked", {
		fontFamily: "Arial",
		fontSize: 20,
		fill: 0x000000,
		wordWrap: true,
		wordWrapWidth: scene.viewport.screenWidth
	});
	textThree.x = ((WIDTH/3) * 2.5 );
	textThree.y = 50;
	container.addChild(textThree)

	scene.viewport.addChild(container);
}