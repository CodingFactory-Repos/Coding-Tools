<template>
	<div class="grow h-full flex justify-start items-end bg-darker-primary overflow-x-scroll px-1 gap-1" style="scrollbar-width: none;">
		<div
			class="bg-dark-tertiary border-x border-t border-dark-highlight w-40 min-w-[10rem] h-[80%] rounded-t-xl pl-4 pr-2 flex justify-between items-center cursor-pointer"
			:class="{ '!bg-dark-secondary !border-[#2e7bbe]': selected.index === 0 }"
			@click="selectDefault"
		>
			<div class="flex gap-2">
				<SvgAbstract width="14" height="14" :class="{ 'fill-white-icon dark:fill-white-icon': selected.index === 0 }"/>
				<span class="text-xs text-light-tertiary font-bold">Projet name</span>
			</div>
		</div>
		<div
			v-for="(_, i) in frames"
			@click="selectTab(i)"
			class="bg-dark-tertiary border-x border-t border-dark-highlight w-40 min-w-[10rem] h-[80%] rounded-t-xl pl-4 pr-2 flex justify-between items-center cursor-pointer"
			:class="{ '!bg-dark-secondary !border-[#2e7bbe]': selected.index === _.index }"
			:key="`tab_${i}`"
		>
			<div class="flex gap-2">
				<SvgFrame width="14" height="14" :class="{ 'fill-white-icon dark:fill-white-icon': selected.index === _.index }"/>
				<span class="text-xs text-light-tertiary font-bold">Frame {{ _.index  }}</span>
			</div>
			<button
				class="w-4 h-4 flex justify-center items-center hover:bg-dark-highlight rounded-lg"
				:class="{ 'hover:!bg-[#2e7bbe]': selected.index === _.index }"
				@click.stop="removeFrame(i)"
			>
				<SvgCross width="10" height="10" class="fill-white-icon dark:fill-white-icon"/>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import SvgAbstract from '@/components/common/svg/Abstract.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgCross from '@/components/common/svg/Cross.vue';

const frames = ref([
	{
		index: 1,
	},
	{
		index: 2,
	},
	{
		index: 3,
	},
	{
		index: 4,
	},
	{
		index: 5,
	},
]);

const selected = ref({ index: 0 });

const selectDefault = () => {
	selected.value = { index: 0 };
}

const selectTab = (index: number) => {
	selected.value = frames.value[index];
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