<template>
	<div class="grow h-full flex justify-start items-end bg-darker-primary overflow-x-scroll px-1 gap-1" style="scrollbar-width: none;">
		<div
			class="bg-dark-tertiary border-x border-t border-dark-highlight w-40 min-w-[10rem] h-[80%] rounded-t-xl pl-4 pr-2 flex justify-between items-center cursor-pointer"
			:class="{ '!bg-dark-secondary !border-[#2e7bbe]': selectedNumber === null }"
			@click="selectDefault"
		>
			<div class="flex gap-2">
				<SvgAbstract width="14" height="14" :class="{ 'fill-white-icon dark:fill-white-icon': selectedNumber === null }"/>
				<span class="text-xs text-light-tertiary font-bold">Projet name</span>
			</div>
		</div>
		<div
			v-for="(frameNumber, i) in frames"
			@click="selectTab(frameNumber)"
			class="bg-dark-tertiary border-x border-t border-dark-highlight w-40 min-w-[10rem] h-[80%] rounded-t-xl pl-4 pr-2 flex justify-between items-center cursor-pointer"
			:class="{ '!bg-dark-secondary !border-[#2e7bbe]': selectedNumber === frameNumber }"
			:key="`tab_${i}`"
		>
			<div class="flex gap-2">
				<SvgFrame width="14" height="14" :class="{ 'fill-white-icon dark:fill-white-icon': selectedNumber === frameNumber }"/>
				<span class="text-xs text-light-tertiary font-bold">Frame {{ frameNumber }}</span>
			</div>
			<button
				class="w-4 h-4 flex justify-center items-center hover:bg-dark-highlight rounded-lg"
				:class="{ 'hover:!bg-[#2e7bbe]': selectedNumber === frameNumber }"
				@click.stop="removeFrame(frameNumber)"
			>
				<SvgCross width="10" height="10" class="fill-white-icon dark:fill-white-icon"/>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Swal from 'sweetalert2';
import { computed, watch, toRaw } from 'vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';

import SvgAbstract from '@/components/common/svg/Abstract.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgCross from '@/components/common/svg/Cross.vue';
import { FramedContainer } from '../../../lib/pixi-tools-v2/class/framedContainer';

const projectStore = useProjectStorev2();
const frames = computed(() => projectStore.getFrames);
const viewport = computed(() => projectStore?.scene?.viewport);
const selectedNumber = computed(() => projectStore.selectedFrameNumber);

watch(frames, val => {
	if(selectedNumber.value !== null) {
		const index = val.indexOf(selectedNumber.value);
		if(index === -1) {
			projectStore.selectedFrameNumber = null;
		}
	}
});

const deleteCanvasUI = () => {
	viewport.value.manager.deselectAll();
	viewport.value.manager.detachPlugins();
}

const selectDefault = () => {
	deleteCanvasUI();
	projectStore.setDefaultCanvas();
	projectStore.selectedFrameNumber = null;
}

const selectTab = (frameNumber: number) => {
	deleteCanvasUI();
	projectStore.selectedFrameNumber = frameNumber;
	projectStore.setFrameCanvas(frameNumber);
}

const removeFrame = async (frameNumber: number) => {
	const res = await Swal.fire({
		title: "Are you sure ?",
		text: "If you proceed, the frame will be deleted as it is an action outside of the canvas.",
		icon: 'info',
		showCancelButton: true,
		cancelButtonColor: '',
		focusConfirm: false,
		cancelButtonText: 'Cancel',
		confirmButtonColor: 'red',
		confirmButtonText: 'Confirm',
		reverseButtons: true,
		width: 400,
	});

	if(res.isConfirmed) {
		const vp = toRaw(viewport.value);
		const frame = vp.children.find((ctn) => {
			if(ctn instanceof FramedContainer && ctn.frameNumber === frameNumber) {
				return ctn;
			}
		})

		if(vp.socketPlugin) {
			vp.socketPlugin.emit('ws-element-deleted', frame.uuid);
		}

		frame.destroy();
		selectDefault();
	}
}
</script>