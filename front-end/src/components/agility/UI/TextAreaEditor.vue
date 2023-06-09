<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useProjectStore } from '@/store/modules/project.store';
import { GenericContainer } from '@/lib/pixi-tools-v2/class/genericContainer';
import { LineContainer } from '@/lib/pixi-tools-v2/class/lineContainer';
import { FramedContainer } from '@/lib/pixi-tools-v2/class/framedContainer';
import { useThemeStore } from '@/store/modules/theme.store';
import { TextContainer } from '@/lib/pixi-tools-v2/class/textContainer';

interface TextAreaEditor {
	font_size: number;
}

defineProps<{
	position: string;
}>();

const projectStore = useProjectStore();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme);

//! It's hard to watch an array of object without using deep, but deep is too exaustive there.
const selectedContainers = computed(() => projectStore.getSelected);
//! This is used to trigger the watch, that's its sole purpose.
const selectedUUID = computed(() => selectedContainers.value.map((ctn) => ctn.uuid));

const colorPickerOpen = ref(false);
const color = ref();

const changeColor = (col: ColorPickerUpdate) => {
	if (col.hex === '' || col.hex === '#') return;
	color.value = col.hex;

	const len = selectedContainers.value.length;
	for (let n = 0; n < len; n++) {
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
		});

		if (projectStore.scene.viewport.socketPlugin) {
			const parent = graphic.parent;
			// TODO: Thomas, remove this when readuy for the live editing
			if (parent instanceof TextContainer) continue;
			if (parent instanceof GenericContainer || parent instanceof LineContainer) {
				projectStore.scene.viewport.socketPlugin.emit(
					'ws-element-colorized',
					parent.uuid,
					parent.serializedColorimetry(),
				);
			} else {
				const frame = parent.parent as FramedContainer;
				projectStore.scene.viewport.socketPlugin.emit(
					'ws-element-colorized',
					frame.uuid,
					frame.serializedColorimetry(),
				);
			}
		}
	}
};

const toggleColorPicker = () => {
	colorPickerOpen.value = !colorPickerOpen.value;
};

watch(colorPickerOpen, (val) => {
	projectStore.scene.viewport.manager.isEditingContainerProperties = val;
});

watch(selectedUUID, () => {
	colorPickerOpen.value = false;
	const len = selectedContainers.value.length;
	if (len === 0 || len > 1) {
		color.value = undefined;
	} else {
		const graphic = selectedContainers.value[0].getGraphicChildren()[0];

		// TODO: The librarby doesn't seem to convert hex with opacity, it's a bit.. unfortunate.
		color.value = addOpacityToHex(decimToHex(graphic.color), graphic.alpha);
	}
});
</script>

<style lang="scss">
.hu-color-picker {
	width: fit-content !important;
}

.multicolor {
	background: linear-gradient(217deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 0) 70.71%),
		linear-gradient(127deg, rgba(0, 255, 0, 1), rgba(0, 255, 0, 0) 70.71%),
		linear-gradient(336deg, rgba(0, 0, 255, 1), rgba(0, 0, 255, 0) 70.71%);
}
</style>
