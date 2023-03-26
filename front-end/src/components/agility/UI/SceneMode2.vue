<template>
	<SelectionBox>
		<template #top>
			<div class="flex bg-light-secondary dark:bg-dark-primary gap-2 p-1 rounded h-12 shadow-md pointer-events-auto">
				<DefaultButton
					to="/app/agility/dashboard"
					text="Dashboard"
					text-style="text-white hover:text-white"
					background="gradiant"
				>
					<SvgArrows class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
				<hr class="h-full w-px bg-light-tertiary dark:bg-dark-tertiary border-none" />
				<!-- <DefaultButton
					@click="activateProjectModal"
					:text="meta.title"
					type="button"
					text-style="text-dark-font"
				/> -->
			</div>
			<div class="flex bg-light-secondary dark:bg-dark-primary gap-2 p-1 rounded h-12 items-center shadow-md pointer-events-auto">
				<IconButton type="button">
					<SvgGear/>
				</IconButton>
				<DefaultButton
					type="button"
					text="Share"
					text-style="text-white hover:text-white"
					background="gradiant"
				>
					<SvgGroup class="fill-white-icon dark:fill-white-icon"/>
				</DefaultButton>
			</div>
		</template>
		<template #left>
			<div class="flex flex-col bg-light-secondary dark:bg-dark-primary gap-2 p-1 rounded w-12 shadow-md pointer-events-auto">
				<IconButton  type="button">
					<SvgCursor />
				</IconButton>
				<IconButton  type="button">
					<SvgText />
				</IconButton>
				<IconButton  type="button" @click="createRectangle">
					<SvgPostIt />
				</IconButton>
				<IconButton  type="button" @click="createFrame">
					<SvgFrame />
				</IconButton>
				<IconButton type="button">
					<SvgShape/>
				</IconButton>
				<IconButton type="button">
					<SvgFocus/>
				</IconButton>
			</div>
			<div class="flex flex-col bg-light-secondary dark:bg-dark-primary gap-2 p-1 rounded w-12 shadow-md pointer-events-auto">
				<IconButton type="button">
					<SvgDownload/>
				</IconButton>
				<IconButton type="button">
					<SvgProject/>
				</IconButton>
			</div>
		</template>
		<template #bottom>
			<div class="flex bg-light-secondary dark:bg-dark-primary gap-2 p-1 rounded h-12 items-center shadow-md pointer-events-auto">
				<!-- <IconButton type="button" @click="toggleFullScreen" v-if="!isFullScreen">
					<SvgExpand/>
				</IconButton> -->
				<!-- <IconButton type="button" @click="toggleFullScreen" v-else>
					<SvgShrink/>
				</IconButton> -->
				<hr class="h-full w-px bg-light-tertiary dark:bg-dark-tertiary border-none" />
				<IconButton type="button">
					<SvgMinus/>
				</IconButton>
				<!-- <span class="font-semibold text-sm">{{ scale }}%</span> -->
				<IconButton type="button" >
					<SvgAdd/>
				</IconButton>
			</div>
			<div class="flex bg-light-secondary dark:bg-dark-primary gap-2 p-1 rounded h-12 shadow-md pointer-events-auto">
				<IconButton type="button" @click="toggleDrawer">
					<SvgSideBar/>
				</IconButton>
			</div>
		</template>
		<template #drawer-right>
			<div class="h-full bg-light-secondary dark:bg-dark-primary duration-200 transition-width pointer-events-auto" :style="drawerOpen ? 'width: 250px;' : 'width: 0;'">
				
			</div>
		</template>
	</SelectionBox>

	<ModalProject v-if="activate" @close="deactivateProjectModal"/>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

/**zfzefzef */

import SelectionBox from '@/components/common/uix/SelectionBox.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import IconButton from '@/components/common/buttons/Icon.vue';
import { Target } from '@/store/interfaces/project.interface';
import ModalProject from '@/components/agility/modals/Project.vue';

import SvgArrows from '@/components/common/svg/Arrows.vue';
import SvgGear from '@/components/common/svg/Gear.vue';
import SvgGroup from '@/components/common/svg/Group.vue';
import SvgCursor from '@/components/common/svg/Cursor.vue';
import SvgText from '@/components/common/svg/Text.vue';
import SvgPostIt from '@/components/common/svg/PostIt.vue';
import SvgFrame from '@/components/common/svg/Frame.vue';
import SvgShape from '@/components/common/svg/Shape.vue';
import SvgFocus from '@/components/common/svg/Focus.vue';
import SvgDownload from '@/components/common/svg/Download.vue';
import SvgProject from '@/components/common/svg/Project.vue';
import SvgExpand from '@/components/common/svg/Expand.vue';
import SvgMinus from '@/components/common/svg/Minus.vue';
import SvgAdd from '@/components/common/svg/Add.vue';
import SvgSideBar from '@/components/common/svg/SideBar.vue';
import SvgShrink from '@/components/common/svg/Shrink.vue';
import { useProjectStorev2 } from '@/store/modules/project2.store';

// const emit = defineEmits(['update:focus-mode'])

const projectStore = useProjectStorev2();
const activate = ref(false);
const drawerOpen = ref(false);

const createRectangle = () => {
	projectStore.deferredGeometry = "RECTANGLE";
	projectStore.setDeferredEvent("pointer", false);
}

const createFrame = () => {
	projectStore.deferredGeometry = "RECTANGLE";
	projectStore.setDeferredEvent("pointer", true);
}

const activateProjectModal = () => activate.value = true;
const deactivateProjectModal = () => activate.value = false;
const toggleDrawer = () => drawerOpen.value = !drawerOpen.value;
</script>

<style>
.prevent-border:focus {
	box-shadow: none !important;
}
</style>