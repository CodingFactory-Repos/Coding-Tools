<template>
	<SelectionBox class="grow h-auto">
		<template #bottom>
			<div class="flex bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 items-center shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="toggleFullScreen" v-if="!isFullScreen">
					<SvgExpand width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="toggleFullScreen" v-else>
					<SvgShrink width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<hr class="h-2/3 w-px bg-light-tertiary dark:bg-gray-400 border-none" />
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="decreaseZoom">
					<SvgMinus width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<span class="font-semibold text-sm text-gray-400">{{ scale }}%</span>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="increaseZoom">
					<SvgAdd width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
			</div>
			<div class="flex bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 items-center shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="toggleDrawer">
					<SvgSideBar width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
			</div>
		</template>
		<template #drawer-right>
			<div class="h-full bg-light-secondary dark:bg-dark-tertiary duration-200 transition-width pointer-events-auto" :style="drawerOpen ? 'width: 250px;' : 'width: 0;'">
				
			</div>
		</template>
	</SelectionBox>

	<ModalProject v-if="activate" @close="deactivateProjectModal"/>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import SelectionBox from '@/components/common/uix/SelectionBox.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import ModalProject from '@/components/agility/modals/Project.vue';

import SvgExpand from '@/components/common/svg/Expand.vue';
import SvgMinus from '@/components/common/svg/Minus.vue';
import SvgAdd from '@/components/common/svg/Add.vue';
import SvgSideBar from '@/components/common/svg/SideBar.vue';
import SvgShrink from '@/components/common/svg/Shrink.vue';
import { useProjectStore } from '@/store/modules/project.store';

const projectStore = useProjectStore();

const isDefault = computed(() => projectStore.default);
watch(isDefault, val => {
	if(val) projectStore.enableSelectionBox()
	else projectStore.enableSelectionBox(true);
});

const scale = computed(() => projectStore.getZoom);
const isFullScreen = computed(() => projectStore.onFullscreen);

const activate = ref(false);
const drawerOpen = ref(false);

const increaseZoom = () => {
	projectStore.increaseZoom();
}

const decreaseZoom = () => {
	projectStore.decreaseZoom();
}

const deactivateProjectModal = () => activate.value = false;
const toggleDrawer = () => drawerOpen.value = !drawerOpen.value;

function toggleFullScreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
}
</script>

<style>
.prevent-border:focus {
	box-shadow: none !important;
}
</style>