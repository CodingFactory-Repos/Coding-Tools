<template>
	<canvas ref="pixi" id="pixi"></canvas>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as PIXI from 'pixi.js'
import TextInput, { InputOption, InputCursorStyle } from "@/pixiUtils/TextInput";

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
				backgroundColor: 0XAAAA,
				// backgroundAlpha: 0
			})

			const rectangle = new PIXI.Graphics();
			rectangle.interactive = true;
			rectangle.cursor = "pointer";
			rectangle.on('pointerdown', onClick);
			rectangle.on('pointerdown', onDragStart, rectangle)

			rectangle.lineStyle({ width: 4, color: 0xFF3300, alpha: 1 });
			rectangle.beginFill(0x66CCFF);
			rectangle.drawRect(0, 0, 64, 64);
			rectangle.endFill();
			rectangle.x = 170;
			rectangle.y = 170;
			app.stage.addChild(rectangle);

			var container = new PIXI.Container();
			const style: any = {
				fontSize: "16px",
				padding: "12px",
				width: "200px",
				color: "#26272E"
			};
			let textField = new PIXI.Text("this._value");
			textField.position.set(400, 96);
			textField.interactive = true;
			let caretIndex = 0;
			app.stage.addChild(textField);

			var option = new InputOption();
			option.style = { fontSize: 12 };
			option.value = "A simple text input";
			var input = new TextInput(option);
			app.stage.addChild(input);


			app.stage.addChild(container);



			const message = new PIXI.Text("Hello Pixi!");
			message.interactive = true;
			message.accessibleType = "input";
			// message.cursor = "pointer";
			message._accessibleActive = true;
			message.on('pointerdown', onClick);
			message.on('pointerdown', onDragStart, message)
			message.on('touchcancel', cancel, message)

			function cancel() {
				console.log("azeoazkeoaz");

			}
			function onClick() {
				// rectangle.scale.x *= 1.25;
				// rectangle.scale.y *= 1.25;
				message.updateText(true)
			}

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

			var option = new InputOption();
			option.backgroundColorFocus = { color: 0xcffbff, alpha: 1 };
			option.backgroundColor = { color: 0xe02f5e, alpha: 1 };
			option.multiLine = true;
			option.maxLength = 100;
			option.roundedBorder = 40;
			option.borderWidth = 5;
			option.style = {
				fontFamily: "Arial",
				fontSize: 36,
				fontStyle: "italic",
				fontWeight: "bold",
				fill: ["#ffffff", "#00ff99"], // gradient
				stroke: "#4a1850",
				strokeThickness: 5,
				dropShadow: true,
				dropShadowColor: "#000000",
				dropShadowBlur: 4,
				dropShadowAngle: Math.PI / 6,
				dropShadowDistance: 6
			};
			option.height = 60;
			option.width = 400;
			option.value = "A complexe text input";

			option.cursorStyle = new InputCursorStyle();
			option.cursorStyle.distance = 0;
			option.cursorStyle.colorBlind = { color: 0xff0000, alpha: 1 };
			option.cursorStyle.colorLow = { color: 0x00ffff, alpha: 0.5 };
			option.cursorStyle.width = 10;
			option.cursorStyle.speedSwap = 200;
			var input = new TextInput(option);

			app.stage.addChild(input);

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

		};

		onMounted(() => {
			drawPixi()
		})

		return {
			pixi,
			drawPixi
		}
	}
})
</script>




<!--
// let input;
// input = new PUXI.TextInput({
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
// app.stage.addChild(input); -->
