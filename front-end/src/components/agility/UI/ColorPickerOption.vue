<template>
	<div class="relative" v-if="selectedUUID.length > 0">
		<IconButton class="h-fit" :class="btnStyle" type="button" @click="toggleColorPicker">
			<div
				class="w-[22px] h-[22px] rounded-full border border-[#9ca3af]"
				:class="{ 'multicolor': color === undefined }"
				:style="{ background: color }"
			></div>
		</IconButton>
		<div
			class="absolute z-10"
			:class="position"
			v-if="colorPickerOpen"
		>
			<ColorPicker
				:theme="isDark ? 'dark' : 'light'"
				:color="color"
				@changeColor="changeColor"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { ColorPicker } from 'vue-color-kit';

import IconButton from '@/components/common/buttons/Icon.vue';
import { useProjectStore } from '@/store/modules/project.store';
import { GenericContainer } from '../../../lib/pixi-tools-v2/class/genericContainer';
import { LineContainer } from '../../../lib/pixi-tools-v2/class/lineContainer';
import { FramedContainer } from '../../../lib/pixi-tools-v2/class/framedContainer';
import { useThemeStore } from '@/store/modules/theme.store';

interface ColorPickerUpdate {
	hex: string;
	hsv: {
		h: number;
		s: number;
		v: number;
	};
	rgba: {
		a: number;
		b: number;
		g: number;
		r: number;
	}
}

defineProps<{
	position: string;
	btnStyle?: string;
}>()

const projectStore = useProjectStore();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme);

//! It's hard to watch an array of object without using deep, but deep is too exaustive there.
const selectedContainers = computed(() => projectStore.getSelected);
//! This is used to trigger the watch, that's its sole purpose.
const selectedUUID = computed(() => selectedContainers.value.map((ctn) => ctn.uuid));

const colorPickerOpen = ref(false);
const color = ref();

const decimToHex = (color: number) => {
	return "#" + color.toString(16).padStart(6, '0');
}

const hexToDecim = (color: string) => {
	return parseInt(color.replace("#", ""), 16);
}

const addOpacityToHex = (hex: string, opacity: number) => {
	const alpha = Math.round(opacity * 255).toString(16);
	return hex + alpha;
}

const changeColor = (col: ColorPickerUpdate) => {
	if(col.hex === '' || col.hex === '#') return;
	color.value = col.hex;

	const len = selectedContainers.value.length;
	for(let n = 0; n < len; n++) {
		const graphic = selectedContainers.value[n].getGraphicChildren()[0];
		graphic.color = hexToDecim(col.hex);
		graphic.alpha = col?.rgba?.a ?? 1;
		graphic.draw({
			x: graphic.x,
			y: graphic.y,
			width: graphic.width,
			height: graphic.height,
			//@ts-ignore
			radius: graphic.radius,
		})

		if(projectStore.scene.viewport.socketPlugin) {
			const parent = graphic.parent;
			if(parent instanceof GenericContainer || parent instanceof LineContainer) {
				projectStore.scene.viewport.socketPlugin.emit(
					'ws-element-colorized',
					parent.uuid,
					parent.serializedColorimetry(),
				)
			} else {
				const frame = parent.parent as FramedContainer;
				projectStore.scene.viewport.socketPlugin.emit(
					'ws-element-colorized',
					frame.uuid,
					frame.serializedColorimetry(),
				)
			}
		}
	}
}

const toggleColorPicker = () => {
	colorPickerOpen.value = !colorPickerOpen.value;
}

watch(colorPickerOpen, (val) => {
	projectStore.scene.viewport.manager.isEditingContainerProperties = val;
})

watch(selectedUUID, () => {
	colorPickerOpen.value = false;
	const len = selectedContainers.value.length;
	if(len === 0 || len > 1) {
		color.value = undefined;
	} else {
		const graphic = selectedContainers.value[0].getGraphicChildren()[0];

		// TODO: The librarby doesn't seem to convert hex with opacity, it's a bit.. unfortunate.
		color.value = addOpacityToHex(decimToHex(graphic.color), graphic.alpha);
	}
})
</script>

<style lang="scss">
.hu-color-picker {
	width: fit-content !important;
}

.multicolor {
	background:
		linear-gradient(217deg, rgba(255,0,0,1), rgba(255,0,0,0) 70.71%),
		linear-gradient(127deg, rgba(0,255,0,1), rgba(0,255,0,0) 70.71%),
		linear-gradient(336deg, rgba(0,0,255,1), rgba(0,0,255,0) 70.71%);
}
</style>