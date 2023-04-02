<template>
	<SelectionBox class="grow h-auto">
		<template #top>
			<div class="flex gap-2 p-1 rounded h-10 items-center pointer-events-auto">
				<DefaultButton
					to="/app/agility/dashboard"
					text="Dashboard"
					text-style="text-white hover:text-white"
					background="gradiant"
					class="h-9"
				>
					<SvgArrows class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
				<!-- <hr class="h-full w-px bg-light-tertiary dark:bg-dark-tertiary border-none" /> -->
				<!-- <DefaultButton
					@click="activateProjectModal"
					:text="meta.title"
					type="button"
					text-style="text-dark-font"
				/> -->
			</div>
			<div class="flex bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 items-center shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgGear width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<DefaultButton
					type="button"
					text="Share"
					text-style="text-white hover:text-white"
					background="gradiant"
					class="h-9"
				>
					<SvgGroup class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
			</div>
		</template>
		<template #left>
			<div class="flex flex-col bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded w-10 shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgCursor width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': isDefault }"/>
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgText width="22" height="22" class="!fill-gray-400" />
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="createRectangle">
					<SvgPostIt width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="createFrame">
					<SvgFrame width="22" height="22" class="!fill-gray-400" />
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgShape width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
			</div>
			<div class="flex flex-col bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded w-10 shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgDownload width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgProject width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
			</div>
		</template>
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
			<div class="flex bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 shadow-md pointer-events-auto">
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
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import ModalProject from '@/components/agility/modals/Project.vue';

import SvgArrows from '@/components/common/svg/Arrows.vue';
import SvgGear from '@/components/common/svg/Gear.vue';
import SvgGroup from '@/components/common/svg/Group.vue';
import SvgCursor from '@/components/common/svg/Cursor.vue';
import SvgText from '@/components/common/svg/Text.vue';
import SvgPostIt from '@/components/common/svg/PostIt.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgShape from '@/components/common/svg/Shape.vue';
import SvgDownload from '@/components/common/svg/Download.vue';
import SvgProject from '@/components/common/svg/Project.vue';
import SvgExpand from '@/components/common/svg/Expand.vue';
import SvgMinus from '@/components/common/svg/Minus.vue';
import SvgAdd from '@/components/common/svg/Add.vue';
import SvgSideBar from '@/components/common/svg/SideBar.vue';
import SvgShrink from '@/components/common/svg/Shrink.vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';

const projectStore = useProjectStorev2();

const isDefault = computed(() => projectStore.default);
watch(isDefault, val => {
	if(val) projectStore.toggleDefaultCanvasMode()
	else projectStore.toggleDefaultCanvasMode(true);
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

const createRectangle = () => {
	projectStore.deferredGeometry = "RECTANGLE";
	projectStore.setDeferredEvent("pointer", false);
}

const createFrame = () => {
	projectStore.deferredGeometry = "RECTANGLE";
	projectStore.setDeferredEvent("pointer", true);
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