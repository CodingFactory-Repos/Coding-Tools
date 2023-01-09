<template>
	<SelectionBox>
		<template #top>
			<div class="flex bg-white dark:bg-gray-800 gap-2 p-1 rounded h-12 shadow-md pointer-events-auto">
				<DefaultButton to="/agility/dashboard" text="Dashboard" color="text-white hover:text-white"
					background="bg-gradient-to-r from-violet-900 to-pink-600 hover:from-violet-800 hover:to-pink-500">
					<SVGLoader v-bind="{ name: 'arrows', size: '20px', color:'fill-white' }"/>	
				</DefaultButton>
				<hr class="h-full w-px bg-gray-400" />
				<DefaultButton @click="activateProjectModal" type="button" :text="meta.title" color="text-gray-400"/>
			</div>
			<div class="flex bg-white dark:bg-gray-800 gap-2 p-1 rounded h-12 items-center shadow-md pointer-events-auto">
				<IconButton type="button"
					:logo="{ name: 'gear', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<DefaultButton type="button" text="Share" color="text-white hover:text-white"
					background="bg-gradient-to-r from-violet-900 to-pink-600 hover:from-violet-800 hover:to-pink-500">
					<SVGLoader v-bind="{ name: 'group', size: '22px', color: 'fill-white' }"/>
				</DefaultButton>
			</div>
		</template>
		<template #left>
			<div class="flex flex-col bg-white dark:bg-gray-800 gap-2 p-1 rounded w-12 shadow-md pointer-events-auto">
				<IconButton @click="toggleCursor" type="button"
					:logo="{ name: 'cursor', size: '24px', color: target === Target.DEFAULT ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<IconButton @click="toggleText" type="button"
					:logo="{ name: 'text', size: '24px', color: target === Target.TEXT ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<IconButton @click="togglePostIt" type="button"
					:logo="{ name: 'postit', size: '24px', color: target === Target.POSTIT ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<IconButton @click="toggleFrame" type="button"
					:logo="{ name: 'frame', size: '24px', color: target === Target.FRAME ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<IconButton type="button"
					:logo="{ name: 'shape', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<IconButton type="button" @click="startFocusMode"
					:logo="{ name: 'default', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
			</div>
			<div class="flex flex-col bg-white dark:bg-gray-800 gap-2 p-1 rounded w-12 shadow-md pointer-events-auto">
				<IconButton @click="toggleCursor" type="button"
					:logo="{ name: 'download', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<IconButton @click="toggleCursor" type="button"
					:logo="{ name: 'project', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
			</div>
		</template>
		<template #bottom>
			<div class="flex bg-white dark:bg-gray-800 gap-2 p-1 rounded h-12 items-center shadow-md pointer-events-auto">
				<IconButton type="button"
					:logo="{ name: 'expand', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<hr class="h-full w-px bg-gray-400" />
				<IconButton type="button"
					:logo="{ name: 'minus', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
				<span class="font-semibold text-sm">1%</span>
				<IconButton type="button"
				:logo="{ name: 'add', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
			</div>
			<div class="flex bg-white dark:bg-gray-800 gap-2 p-1 rounded h-12 shadow-md pointer-events-auto">
				<IconButton type="button" @click="toggleDrawer"
					:logo="{ name: 'sidebar', size: '24px', color: false ? 'fill-blue-500 dark:fill-blue-400' : 'fill-[#666666] dark:fill-[#666666]' }" />
			</div>
		</template>
		<template #drawer-right>
			<div class="h-full bg-white duration-200 transition-width pointer-events-auto" :style="drawerOpen ? 'width: 250px;' : 'width: 0;'">
				
			</div>
		</template>
	</SelectionBox>

	<ModalProject v-if="activate" @close="deactivateProjectModal"/>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useProjectStore } from '@/store/modules/project.store';
import SelectionBox from '@/components/common/uix/SelectionBox.vue';
import SVGLoader from '@/components/common/SVGLoader';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import { Target } from '@/store/interfaces/project.interface';
import ModalProject from '@/components/agility/modals/Project.vue';

const emit = defineEmits(['update:focus-mode'])

const projectStore = useProjectStore();
const target = computed(() => projectStore.action.target);
const meta = computed(() => projectStore.meta);

const activate = ref(false);
const drawerOpen = ref(false);

const activateProjectModal = () => activate.value = true;
const deactivateProjectModal = () => activate.value = false;
const toggleDrawer = () => drawerOpen.value = !drawerOpen.value;

const toggleCursor = () => projectStore.setAction("default", Target.DEFAULT);
const toggleText = () => projectStore.setAction("text", Target.TEXT);
const togglePostIt = () => projectStore.setAction("postit", Target.POSTIT);
const toggleFrame = () => projectStore.setAction("frame", Target.FRAME);

const startFocusMode = () => {
	projectStore.activateFocusMode();
	emit("update:focus-mode", true);
}
</script>

<style>
.prevent-border:focus {
	box-shadow: none !important;
}
</style>