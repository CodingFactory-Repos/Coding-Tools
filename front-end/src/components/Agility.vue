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

function normalizeGeometryForm(geometry: GeometryForm, isRadius?: boolean) {
	var config = {} as TemplateGeometry;
	config.x = config.y = 0;
	if (isRadius) {
		config.radius = 50;
	}
	if (config.radius == null) {
		config.width = config.height = 100;
	}
	// Need Optimize Him

	return config;
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

var mainCanvas: PIXI.Application<PIXI.ICanvas>;

onMounted(() => {
	initialize();
});

function initialize() {
	const app = new PIXI.Application({
		view: pixi.value,
		resolution: window.devicePixelRatio || 1, // Explain to me what that shit ? (It's troll, logic to convert Pixel 1/1)
		//Set transparent background
		autoDensity: true, // Gné ?
		width: window.innerWidth,
		height: window.innerHeight,
	});
	mainCanvas = app;
}

function drawSpecificGeometry(Geometry: number) {
	var isRadius;
	if (Geometry == 0) {
		isRadius = true;
	}
	var geometryForm = normalizeGeometryForm(Geometry, isRadius);

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

	function onDragMove(event: any) {
		if (dragTarget) {
			dragTarget.parent.toLocal(event.global, null, dragTarget.position);
		}
	}

	function onDragStart(this: any) {
		// store a reference to the data
		// the reason for this is because of multitouch
		// we want to track the movement of this particular touch
		// this.data = event.data;
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
}
</script>

<template>
	<button v-on:click="drawSpecificGeometry(GeometryForm.Circle)">Circle</button>
	<button v-on:click="drawSpecificGeometry(GeometryForm.Rect)">Rectangle</button>
	<button v-on:click="drawSpecificGeometry(GeometryForm.Ellipse)">Ellipse</button>
	<div class="connections">
		<canvas id="pixiCanvas" ref="pixi"></canvas>
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
