<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as PIXI from 'pixi.js';

// -------
// Aliases
// -------

type a_Application = PIXI.Application;
type a_Container = PIXI.Container;
type a_GraphicElement = PIXI.Graphics;

type a_Sprite = PIXI.Sprite;
type a_Circle = PIXI.Circle;
type a_Ellipse = PIXI.Ellipse;
type a_Rectangle = PIXI.Rectangle;

// -------
// End Aliases
// -------

// -------
// Enum & Struct(Interface)
// -------

enum GeometryForm {
	Circle = 0,
	Ellipse = 1,
	Rect = 2,
}
interface TemplateGeometryRectangle {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

interface TemplateGeometryElipse {
	x: number;
	y: number;
	radius?: number;
}

type TemplateGeometry = TemplateGeometryRectangle & TemplateGeometryElipse;

// -------
// End Enum & Struct(Interface)
// -------

// -------
// Class
// -------

class GetSet {
	// isrect: TemplateGeometry = 0;
	// get isRect(): TemplateGeometry {
	// 	if (this.isrect == 0) {
	// 		this.isrect
	// 	}
	// 	return this.isrect;
	// }
	// set isRect(value: TemplateGeometry) {
	// 	this.isrect as  = value;
	// }
}

// -------
// End Class
// -------

//TODO Deleteing System
//TODO Add Children to Container parent
//TODO Select multiple children container to move him
//TODO Create button to pop template
//TODO Create multiple struct with template

onMounted(() => {
	initialize();
});

function normalizeGeometryForm(geometry: GeometryForm, isRadius: boolean, cursorPos: PIXI.IPoint) {
	var config = {} as TemplateGeometry;
	// console.log(cursorPos.x);
	// config.x = cursorPos.x;
	//TODO Change for double step -> First

	if (isRadius) {
		config.radius = 50;
	}
	if (config.radius == null) {
		config.width = config.height = 100;
	}
	return config;
}

function isButtonNeeded(graphics: PIXI.Graphics, isNeeded: boolean) {
	if (isNeeded) {
		//TODO Selected if graphics have button for add or delete child
	}
}
function isTextCreated(graphics: PIXI.Graphics, isNeeded: boolean) {
	if (isNeeded) {
		//TODO Selected if graphics have button for add or delete child
	}
}

function selectedSpecificGeometry(
	element: a_GraphicElement,
	config: TemplateGeometry,
	graphics: PIXI.Graphics,
) {
	graphics.beginFill(0xff3300); //Color
	if (config.radius == null) {
		element.drawRect(config.x, config.y, config.width!, config.height!);
		console.log('Rect');
	} else {
		element.drawCircle(config.x, config.y, config.radius);
		console.log('Circle');
	}
	graphics.interactive = true;
	graphics.endFill();
}

const pixi = ref();
var cursorPos: any;
var mainCanvas: PIXI.Application<PIXI.ICanvas>;

function initialize() {
	const app = new PIXI.Application({
		view: pixi.value,
		resolution: window.devicePixelRatio || 1, // Explain to me what that shit ? (It's troll, logic to convert Pixel 1/1)
		autoDensity: true, // Gné ?
		backgroundAlpha: 0,
		width: window.innerWidth,
		height: window.innerHeight,
	});
	mainCanvas = app;
	mainCanvas.stage.addEventListener('pointermove', (e: any) => {
		cursorPos = e.global;
		console.log(cursorPos);
	});
}

function drawSpecificGeometry(Geometry: number) {
	var isRadius;
	if (Geometry == 0) {
		isRadius = true;
	} else isRadius = false;
	var geometryForm = normalizeGeometryForm(Geometry, isRadius, cursorPos);

	let dragTarget: any = null;
	mainCanvas.stage.interactive = true;
	mainCanvas.stage.hitArea = mainCanvas.screen;
	mainCanvas.stage.on('pointerup', onDragEnd);
	mainCanvas.stage.on('pointerupoutside', onDragEnd);

	var stage = new PIXI.Container();
	stage.interactive = true;
	const graphics = new PIXI.Graphics();

	selectedSpecificGeometry(graphics, geometryForm, graphics);

	stage.addChild(graphics); // Set in Containr
	mainCanvas.stage.addChild(stage); // Set in Parent
	graphics.on('pointerdown', onDragStart, graphics);
	graphics.on('mousedown', onDown, graphics);

	function onDragMove(event: any) {
		if (dragTarget) {
			dragTarget.parent.toLocal(event.global, null, dragTarget.position);
		}
	}

	function onDown(this: any) {
		var buttonText = new PIXI.Text('End Turn', {
			fontFamily: 'Arial',
			fontSize: 24,
			fill: 'white',
			align: 'right',
		});
		buttonText.anchor.set(0.5, 0.5);
		buttonText.position.set(75, 50);
		this.addChild(buttonText);
	}
	function onDragStart(this: any) {
		this.alpha = 0.5;
		dragTarget = this;
		mainCanvas.stage.on('pointermove', onDragMove);
	}

	function onDragEnd() {
		if (dragTarget) {
			mainCanvas.stage.off('pointermove', onDragMove);
			dragTarget.alpha = 1;
			dragTarget = null;
		}
	}
	//TODO patch Ellipse before go in prod
	//<button id="pixiButton" v-on:click="drawSpecificGeometry(GeometryForm.Ellipse)">Ellipse</button>
}
</script>

<template>
	<div class="connections">
		<button id="pixiButton" v-on:click="drawSpecificGeometry(GeometryForm.Rect)">Rectangle</button>
		<button id="pixiButtonCircle" v-on:click="drawSpecificGeometry(GeometryForm.Circle)">
			Circle
		</button>
		<canvas id="pixiCanvas" ref="pixi"></canvas>
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
#pixiButton {
	position: absolute;
	left: 0px;
}
#pixiButtonCircle {
	position: absolute;
	left: 0px;
	top: 80px;
}
.connections {
	position: relative;
}
</style>
