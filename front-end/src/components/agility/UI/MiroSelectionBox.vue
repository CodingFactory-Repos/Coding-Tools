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
			</div>
			<div class="flex bg-light-primary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 items-center shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="openManagerModal" v-if="isOwner">
					<SvgGear width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
				<DefaultButton
					type="button"
					text="Share"
					text-style="text-white hover:text-white"
					background="gradiant"
					class="h-9"
					@click="openShareModal"
				>
					<SvgGroup class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
			</div>
		</template>
		<template #left>
			<div class="flex flex-col bg-light-primary dark:bg-dark-tertiary gap-2 p-1 rounded w-[42px] shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="setDefaultMode">
					<SvgCursor width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': isDefault }"/>
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button">
					<SvgText width="22" height="22" class="!fill-gray-400" />
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="createFrame">
					<SvgFrame width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'framebox' }"/>
				</IconButton>
				<div class="relative flex items-center justify-center z-10">
					<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="toggleGeometryPopUp">
						<SvgShape width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': showGeometryPopUp}"/>
					</IconButton>
					<div
						v-if="showGeometryPopUp"
						class="absolute right-[-60px] w-[42px] h-fit p-1 bg-light-primary dark:bg-dark-tertiary rounded flex flex-col items-center justify-center"
					>
						<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="createGeometry('rectangle')">
							<SvgRectangle width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'rectangle' }"/>
						</IconButton>
						<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="createGeometry('circle')">
							<SvgCircle width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'circle' }"/>
						</IconButton>
						<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="createGeometry('triangle')">
							<SvgTriangle width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': selectedGeometry === 'triangle' }"/>
						</IconButton>
					</div>
				</div>
			</div>
			<div class="flex flex-col items-center justify-center bg-light-primary dark:bg-dark-tertiary gap-2 p-1 rounded w-[42px] shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="onContextMenu">
					<SvgDownload width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': showDownloadContextMenu }"/>
					<ContextMenu
						v-model:show="showDownloadContextMenu"
						:options="contextMenuOptions"
					>
						<ContextMenuItem class="cursor-pointer border-b-[0.1px] border-gray-200" @click="download(DownloadType.MIME_PNG)">
							<span class="text-sm text-center w-full">Export PNG</span>
						</ContextMenuItem>
						<ContextMenuItem class="cursor-pointer border-b-[0.1px] border-gray-200" @click="download(DownloadType.MIME_JPG)">
							<span class="text-sm text-center w-full">Export JPG</span>
						</ContextMenuItem>
						<ContextMenuItem class="cursor-pointer" @click="download(DownloadType.MIME_WEBP)">
							<span class="text-sm text-center w-full">Export WEBP</span>
						</ContextMenuItem>
					</ContextMenu>
				</IconButton>
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="openBlueprintModal">
					<SvgProject width="22" height="22" class="!fill-gray-400" :class="{ '!fill-selected-icon dark:!fill-selected-icon': isBlueprintModalOpen }"/>
				</IconButton>
				<ColorPickerOption position="bottom-[-212px] left-[45px]" btnStyle="!p-1.5 dark:hover:!bg-dark-secondary"/>
			</div>
		</template>
		<template #bottom>
			<div class="flex bg-light-primary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 items-center shadow-md pointer-events-auto">
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
			<div class="flex items-center justify-center bg-light-secondary dark:bg-dark-tertiary gap-2 p-1 rounded h-10 w-10 shadow-md pointer-events-auto">
				<IconButton class="h-fit !p-1.5 dark:hover:!bg-dark-secondary" type="button" @click="toggleDrawer">
					<SvgSideBar width="22" height="22" class="!fill-gray-400"/>
				</IconButton>
			</div>
		</template>
		<template #drawer-right>
			<div
				class="relative border-l dark:border-darker-primary h-full bg-light-secondary dark:bg-dark-primary duration-200 transition-width pointer-events-auto overflow-hidden"
				:style="drawerOpen ? 'width: 550px;' : 'width: 0;' "
			>
				<div class="h-full w-full overflow-y-scroll pb-16">
					<Draggable :list="childImages" itemKey="id" class="list-group" @start="dragging = true" @end="dragging = false" @change="handleListChange">
						<template #item="{ element }">
							<div class="list-group-item flex flex-col gap-2 relative p-3 pl-[2.75rem] hover:bg-dark-tertiary cursor-pointer">
								<span class="absolute top-2 left-[1rem] text-white font-bold text-lg">{{ element.order }}</span>
								<div class="border-2 border-dark-highlight rounded-lg overflow-hidden w-full h-36">
									<img :src="element.base64" class="w-full h-full object-fit" :alt="`image_frame_${element.id}`">
								</div>
								<div class="flex items-center justify-center">
									<span class="text-xs text-white font-bold bg-[#85397c] px-3 py-0.5 rounded-lg">
										{{ element.dimension.width }} x {{ element.dimension.height }}
									</span>
								</div>
							</div>
						</template>
					</Draggable>
				</div>
				<div class="w-full flex justify-center items-center h-16 absolute bottom-0 bg-light-secondary dark:bg-dark-secondary">
					<DefaultButton
						text="Export to PDF"
						text-style="text-black dark:text-white font-bold text-sm"
						background="bg-light-secondary hover:bg-light-tertiary dark:bg-dark-tertiary"
						class="w-32 min-w-[8rem]"
						@click="generatePdf()"
					/>
				</div>
			</div>
		</template>
	</SelectionBox>
	<ShareProject
		v-if="isShareModalOpen"
		@close="closeShareModal"
	/>
	<ManageUser
		v-if="isOwner && isManagerModalOpen"
		@close="closeManagerModal"
	/>
	<BlueprintModal
		v-if="isBlueprintModalOpen"
		@close="closeBlueprintModal"
	/>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import { useProjectStore } from '@/store/modules/project.store';
import { type MenuOptions, ContextMenu, ContextMenuItem } from '@imengyu/vue3-context-menu';
import { DownloadType, LiteralGeometryTypes } from '@/lib/pixi-tools-v2/types/pixi-enums';

import BlueprintModal from '@/components/agility/modals/Blueprint.vue';
import ManageUser from '@/components/agility/UI/ManageUser.vue';
import ShareProject from '@/components/agility/UI/ShareProject.vue';
import ColorPickerOption from '@/components/agility/UI/ColorPickerOption.vue';
import SelectionBox from '@/components/common/uix/SelectionBox.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';

import Draggable from 'vuedraggable';
import SvgArrows from '@/components/common/svg/Arrows.vue';
import SvgGear from '@/components/common/svg/Gear.vue';
import SvgGroup from '@/components/common/svg/Group.vue';
import SvgCursor from '@/components/common/svg/Cursor.vue';
import SvgText from '@/components/common/svg/Text.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgShape from '@/components/common/svg/Shape.vue';
import SvgDownload from '@/components/common/svg/Download.vue';
import SvgProject from '@/components/common/svg/Project.vue';
import SvgExpand from '@/components/common/svg/Expand.vue';
import SvgMinus from '@/components/common/svg/Minus.vue';
import SvgAdd from '@/components/common/svg/Add.vue';
import SvgCircle from '@/components/common/svg/Circle.vue';
import SvgRectangle from '@/components/common/svg/Rectangle.vue';
import SvgTriangle from '@/components/common/svg/Triangle.vue';
import SvgSideBar from '@/components/common/svg/SideBar.vue';
import SvgShrink from '@/components/common/svg/Shrink.vue';
import { useAgilityStore } from '@/store/modules/agility.store';
import * as _ from 'pdfmake/build/vfs_fonts.js';
import { exportToPdf} from '@/lib/pixi-tools-v2/utils/generatePdf';


const projectStore = useProjectStore();
const agilityStore = useAgilityStore();

const isOwner = computed(() => agilityStore.isOwner);
const selectedGeometry = computed(() => projectStore.deferredGeometry);
const isDefault = computed(() => projectStore.default);
watch(isDefault, val => {
	if(val) {
		projectStore.enableSelectionBox();
		closeGeometryPopUp();
	}
	else projectStore.enableSelectionBox(true);
});

const scale = computed(() => projectStore.getZoom);
const isFullScreen = computed(() => projectStore.onFullscreen);

const createGeometry = (geometry: LiteralGeometryTypes) => {
	projectStore.deferredGeometry = geometry;
	projectStore.setDeferredEvent("pointer", false);
}

const createFrame = () => {
	closeGeometryPopUp();
	projectStore.deferredGeometry = "framebox";
	projectStore.setDeferredEvent("pointer", true);
}

const dragging = ref(false);
const drawerOpen = computed(() => projectStore.pdfViewerOpen);
const reactiveImages = computed(() => projectStore.getImages);
const refreshImages = computed(() => projectStore.refreshPdfViewer);
const childImages = ref(reactiveImages.value);

watch(refreshImages, () => {
	for(let n = 0; n < reactiveImages.value.length; n++) {
		for(let i = 0; i < childImages.value.length; i++) {
			if(reactiveImages.value[n].id === childImages.value[i].id) {
				childImages.value[i].base64 = reactiveImages.value[n].base64;
				childImages.value[i].dimension.height = reactiveImages.value[n].dimension.height;
				childImages.value[i].dimension.width = reactiveImages.value[n].dimension.width;
				break;
			}
		}
	}
})

watch(reactiveImages, val => {
	const uuids = val.map((img) => img.id);
	if(childImages.value.length === 0 && uuids.length > 0) {
		childImages.value = val;
		return;
	}

	if(uuids.length < childImages.value.length) {
		childImages.value = childImages.value.filter((img) => uuids.includes(img.id));
		handleListChange();
		return;
	}
	
	if(uuids.length > childImages.value.length) {
		childImages.value.push(val[val.length - 1]);
		return;
	}
}, { immediate: true });

const handleListChange = () => {
	for(let n = 0; n < childImages.value.length; n++) {
		childImages.value[n].order = n + 1;
	}
};

const toggleDrawer = () => {
	projectStore.pdfViewerOpen = !projectStore.pdfViewerOpen
}

const increaseZoom = () => {
	projectStore.increaseZoom();
}

const decreaseZoom = () => {
	projectStore.decreaseZoom();
}

const generatePdf = () => {
    exportToPdf(childImages.value);
  };

const setDefaultMode = () => {
	projectStore.default = true;
	projectStore.deferredGeometry = null;
	projectStore.deferredBlueprint = null;
	projectStore.removeGeometryEvent();
}

function toggleFullScreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
}

const contextMenuOptions = ref<MenuOptions>({
	x: 10,
	y: 40,
	zIndex: 999,
	minWidth: 300,
	theme: 'default dark',
	customClass: '!text-white dark:bg-darker-primary shadow-none p-0 overflow-hidden min-w-[10rem]',
})

const showDownloadContextMenu = ref(false);
const onContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showDownloadContextMenu.value = true;
	contextMenuOptions.value.x = e.x;
	contextMenuOptions.value.y = e.y;
}

const download = (mime: string) => {
	projectStore.canvasDownload(mime);
}

const isShareModalOpen = ref(false);
const openShareModal = () => { isShareModalOpen.value = true }
const closeShareModal = () => { isShareModalOpen.value = false }

const isManagerModalOpen = ref(false);
const openManagerModal = () => { isManagerModalOpen.value = true }
const closeManagerModal = () => { isManagerModalOpen.value = false }

const isBlueprintModalOpen = ref(false);
const openBlueprintModal = () => { isBlueprintModalOpen.value = true }
const closeBlueprintModal = () => { isBlueprintModalOpen.value = false }

const showGeometryPopUp = ref(false);
const toggleGeometryPopUp = () => { showGeometryPopUp.value = !showGeometryPopUp.value }
const closeGeometryPopUp = () => {
	if(showGeometryPopUp.value) {
		showGeometryPopUp.value = false
	}
}
</script>