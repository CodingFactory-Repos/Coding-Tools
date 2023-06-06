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
									<img :src="element.base64" class="w-full h-full object-fit">
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
					/>
				</div>
			</div>
		</template>
	</SelectionBox>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import SelectionBox from '@/components/common/uix/SelectionBox.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import Draggable from 'vuedraggable';
import SvgExpand from '@/components/common/svg/Expand.vue';
import SvgMinus from '@/components/common/svg/Minus.vue';
import SvgAdd from '@/components/common/svg/Add.vue';
import SvgSideBar from '@/components/common/svg/SideBar.vue';
import SvgShrink from '@/components/common/svg/Shrink.vue';
import { useProjectStore } from '@/store/modules/project.store';
import DefaultButton from '@/components/common/buttons/Default.vue';

const projectStore = useProjectStore();

const isDefault = computed(() => projectStore.default);
watch(isDefault, val => {
	if(val) projectStore.enableSelectionBox()
	else projectStore.enableSelectionBox(true);
});

const scale = computed(() => projectStore.getZoom);
const isFullScreen = computed(() => projectStore.onFullscreen);

const dragging = ref(false)
const drawerOpen = computed(() => projectStore.pdfViewerOpen);
const reactiveImages = computed(() => projectStore.getImages);
const childImages = ref(reactiveImages.value);

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

function toggleFullScreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
}

const increaseZoom = () => {
	projectStore.increaseZoom();
}

const decreaseZoom = () => {
	projectStore.decreaseZoom();
}

</script>