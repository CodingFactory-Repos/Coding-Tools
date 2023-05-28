<template>
	<div class="relative" v-if="selectedUUID.length > 0">
		<IconButton class="h-fit" type="button" @click="toggleColorPicker">
			<div
				class="w-[22px] h-[22px] rounded-full border border-[#9ca3af]"
				:class="{ 'multicolor': color === undefined }"
				:style="{ background: color }"
			></div>
		</IconButton>
		<div
			class="absolute bottom-[-330px] left-[30px] z-10"
			v-if="colorPickerOpen"
		>
			<ColorPicker
				theme="dark"
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

const projectStore = useProjectStore();

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

const changeColor = (col: { hex: string }) => {
	color.value = col.hex;

	const len = selectedContainers.value.length;
	for(let n = 0; n < len; n++) {
		const graphic = selectedContainers.value[n].getGraphicChildren()[0];
		graphic.color = hexToDecim(col.hex);
		graphic.draw({
			x: graphic.x,
			y: graphic.y,
			width: graphic.width,
			height: graphic.height
		})
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
		color.value = decimToHex(graphic.color);
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