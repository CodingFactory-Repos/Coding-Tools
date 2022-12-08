<script setup lang="ts">
import { ref, defineComponent, onMounted } from 'vue';
import * as PIXI from 'pixi.js'
import {Application} from 'pixi.js'

import { Console } from 'console';

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
	Circle=0,
	Ellipse=1,
	Rect=2,
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




type TemplateGeometry = TemplateGeometryRectangle & TemplateGeometryElipse

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

const graphics = new PIXI.Graphics();

function normalizeGeometryForm(geometry: GeometryForm, isRadius?: boolean) { 
	var config = {} as TemplateGeometry
	config.x = config.y = 100;
	if (isRadius) {
		config.radius = 50
	} 
	if (config.radius ==null) {
		config.width = config.height = 100;
	}
	// Need Optimize Him
	
	return config;
};

function selectedSpecificGeometry(element: a_GraphicElement, config: TemplateGeometry) {
	graphics.beginFill(0xFF3300); //Color
	if (config.radius == null) {
		element.drawRect(config.x, config.y, config.width!, config.height!)
		console.log("Rect");
	} else {
		element.drawCircle(config.x, config.y, config.radius)
		console.log("Circle");

	}
	graphics.interactive = true;
	graphics.endFill();
}

function drawSpecificGeometry(Geometry: number,) {
	var isRadius
	if (Geometry == 0) {
		isRadius = true;
	}
	var onScreenCanvas = document.getElementById("pixi");
	var geometryForm = normalizeGeometryForm(Geometry, isRadius)
	const app = new Application({
		view: onScreenCanvas as HTMLCanvasElement,
		resolution: window.devicePixelRatio || 1, // Explain to me what that shit ? (It's troll, logic to convert Pixel 1/1)
		backgroundAlpha:0, //Set transparent background
		autoDensity: true, // Gné ?
		width: window.innerWidth, 
		height: window.innerHeight, 
		
	});
	document.body.appendChild(onScreenCanvas!);
	
	var stage = new PIXI.Container();
	stage.interactive = true;
	
	selectedSpecificGeometry(graphics, geometryForm)
	
	stage.addChild(graphics);  
	app.stage.addChild(stage);
	graphics
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);
}

var test: PIXI.ObservablePoint<any>;

function onDragStart(this: any, event: { data: any; }) {
	// store a reference to the data
	// the reason for this is because of multitouch
	// we want to track the movement of this particular touch
	test = this.data = event.data;
	this.alpha = 0.5;
	this.dragging = true;
}

function onDragEnd(this: any) {
	this.alpha = 1;
	this.dragging = false;
	// set the interaction data to null
	this.data = null;
}

function onDragMove(this: any) {
	if (this.dragging) {
		this.data = test as PIXI.ObservablePoint;

		this.position.x = this.data.x;
		this.position.y = this.data.y;
	}
}


</script>

<template>
	<button v-on:click=drawSpecificGeometry(GeometryForm.Circle)>Circle</button>
	<button v-on:click=drawSpecificGeometry(GeometryForm.Rect)>Rectangle</button>
	<button v-on:click=drawSpecificGeometry(GeometryForm.Ellipse)>Ellipse</button>
	<div class="connections">
		<canvas id="pixi"></canvas>
	</div>
</template>

<style scoped>
.read-the-docs {
	color: #888;
}
</style>
