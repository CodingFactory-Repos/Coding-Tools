<template>
	<div class="grow h-full flex justify-start items-end bg-darker-primary overflow-x-scroll px-1 gap-1" style="scrollbar-width: none;">
		<div
			class="bg-dark-tertiary border-x border-t border-dark-highlight w-40 min-w-[10rem] h-[80%] rounded-t-xl pl-4 pr-2 flex justify-between items-center cursor-pointer"
			:class="{ '!bg-dark-secondary !border-[#2e7bbe]': selected === null }"
			@click="selectDefault"
		>
			<div class="flex gap-2">
				<SvgAbstract width="14" height="14" :class="{ 'fill-white-icon dark:fill-white-icon': selected === null }"/>
				<span class="text-xs text-light-tertiary font-bold">Projet name</span>
			</div>
		</div>
		<div
			v-for="(frame, i) in frames"
			@click="selectTab(i)"
			class="bg-dark-tertiary border-x border-t border-dark-highlight w-40 min-w-[10rem] h-[80%] rounded-t-xl pl-4 pr-2 flex justify-between items-center cursor-pointer"
			:class="{ '!bg-dark-secondary !border-[#2e7bbe]': selected?.frameNumber === frame.frameNumber }"
			:key="`tab_${i}`"
		>
			<div class="flex gap-2">
				<SvgFrame width="14" height="14" :class="{ 'fill-white-icon dark:fill-white-icon': selected?.frameNumber === frame.frameNumber }"/>
				<span class="text-xs text-light-tertiary font-bold">Frame {{ frame.frameNumber }}</span>
			</div>
			<button
				class="w-4 h-4 flex justify-center items-center hover:bg-dark-highlight rounded-lg"
				:class="{ 'hover:!bg-[#2e7bbe]': selected?.frameNumber === frame.frameNumber }"
				@click.stop="removeFrame(i)"
			>
				<SvgCross width="10" height="10" class="fill-white-icon dark:fill-white-icon"/>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';

import SvgAbstract from '@/components/common/svg/Abstract.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgCross from '@/components/common/svg/Cross.vue';
import { FramedContainer } from '@/lib/pixi-tools-v2/class/framedContainer';

const projectStore = useProjectStorev2();
const frames = computed(() => projectStore.getFrames);

const selected = ref<FramedContainer>(null);

watch(frames, val => {
	if(selected.value !== null) {
		const index = val.indexOf(selected.value as FramedContainer);
		if(index === -1) {
			selected.value = null;
		}
	}
}, { deep: true })

const selectDefault = () => {
	projectStore.setDefaultCanvas();
	selected.value = null;
}

const selectTab = (index: number) => {
	selected.value = frames.value[index];
	projectStore.setFrameCanvas(index);
}

const removeFrame = (index: number) => {
	frames.value.splice(index, 1);
	selectDefault();
}
</script>

<style>
.t {
	color: #2e7bbe
}
</style>