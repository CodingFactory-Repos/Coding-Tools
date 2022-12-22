<template>
	<canvas ref="pixi" id="pixi"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as PIXI from 'pixi.js';
// import * as TEXTINPUT from "pixi-text-input"; // DTS NOT EXIST

export default defineComponent({
	setup() {
		const pixi = ref();

		function drawPixi() {
			const app = new PIXI.Application({
				width: window.innerWidth,
				height: window.innerHeight,
				// width: 640,
				// height: 360,
				antialias: true,
				view: pixi.value,
				backgroundColor: 0xaaaa,
				// backgroundAlpha: 0
			});

			const rectangle = new PIXI.Graphics();
			rectangle.interactive = true;
			rectangle.cursor = 'pointer';
			rectangle.on('pointerdown', onClick);
			rectangle.on('pointerdown', onDragStart, rectangle);

			rectangle.lineStyle({ width: 4, color: 0xff3300, alpha: 1 });
			rectangle.beginFill(0x66ccff);
			rectangle.drawRect(0, 0, 64, 64);
			rectangle.endFill();
			rectangle.x = 170;
			rectangle.y = 170;
			app.stage.addChild(rectangle);
			function onClick() {
				// rectangle.scale.x *= 1.25;
				// rectangle.scale.y *= 1.25;
			}

			// var input;
			// input = new TEXTINPUT({
			// 	input: {
			// 		fontSize: "16px",
			// 		padding: "12px",
			// 		width: "200px",
			// 		color: "#26272E"
			// 	},
			// 	box: {
			// 		default: {
			// 			fill: 0xe8e9f3,
			// 			rounded: 12,
			// 			stroke: { color: 0xcbcee0, width: 3 }
			// 		},
			// 		focused: {
			// 			fill: 0xe1e3ee,
			// 			rounded: 12,
			// 			stroke: { color: 0xabafc6, width: 3 }
			// 		},
			// 		disabled: { fill: 0xdbdbdb, rounded: 12 }
			// 	}
			// });
			// input.interactive = true;

			// input.placeholder = "Enter your Text...";
			// input.x = 400;
			// input.y = 100;
			// input.pivot.x = input.width / 2;
			// input.pivot.y = input.height / 2;
			// input.cursor = "pointer";
			// input.on('pointerdown', onClick);
			// input.on('pointerdown', onDragStart, input)
			// app.stage.addChild(input);

			const message = new PIXI.Text('Hello Pixi!');
			app.stage.addChild(message);
			message.position.set(54, 96);

			let dragTarget: any = null;
			app.stage.interactive = true;
			app.stage.hitArea = app.screen;
			app.stage.on('pointerup', onDragEnd);
			app.stage.on('pointerupoutside', onDragEnd);
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
				app.stage.on('pointermove', onDragMove);
			}

			function onDragEnd() {
				if (dragTarget) {
					app.stage.off('pointermove', onDragMove);
					dragTarget.alpha = 1;
					dragTarget = null;
				}
			}
		}

		onMounted(() => {
			drawPixi();
		});

		return {
			pixi,
			drawPixi,
		};
	},
});
</script>
