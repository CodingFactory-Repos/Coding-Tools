<template>
	<!-- TODO: Rework the board creation -->
	<div
		class="border-solid border-2 border-sky-300 flex min-h-[36rem] max-h-[38rem]"
		v-if="postitsInCurrentRetro"
	>
		<div
			class="border-solid border-2 border-sky-500 flex flex-col flex-1"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(1)"
		>
			<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700"
				v-if="props.optionTemplate === 1">
				<h3>Mad</h3>
			</div>
			<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-else>
				<h3>Liked</h3>
			</div>
			<div
				class="text-black bg-slate-300 flex flex-wrap gap-6 items-start justify-center content-start overflow-y-scroll pt-6 pb-6">
				<Postit v-for="postit in postitsInCurrentRetro[1]" :postit="postit" />
			</div>
		</div>
		<div
			class="border-solid border-2 border-sky-500 flex flex-col flex-1"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(2)"
		>
			<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700"
				v-if="props.optionTemplate === 1">
				<h3>Sad</h3>
			</div>
			<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-else>
				<h3>Learned</h3>
			</div>
			<div
				class="text-black bg-slate-300 flex flex-wrap gap-6 items-start justify-center content-start overflow-y-scroll pt-6 pb-6">
				<Postit v-for="postit in postitsInCurrentRetro[2]" :postit="postit" />
			</div>
		</div>
		<div
			class="border-solid border-2 border-sky-500 flex flex-col flex-1"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(3)"
		>
			<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700"
				v-if="props.optionTemplate === 1">
				<h3>Glad</h3>
			</div>
			<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-else>
				<h3>Lacked</h3>
			</div>
			<div
				class="text-black bg-slate-300 flex flex-wrap gap-6 items-start justify-center content-start overflow-visible pt-6 pb-6">
				<Postit :postit="postit" v-for="postit in postitsInCurrentRetro[3]" />
			</div>
		</div>
		<UserCursors />
		<div class="h-full bg-light-secondary dark:bg-dark-tertiary duration-200 transition-width pointer-events-auto z-100"
			:style="showSideBar ? 'width: 250px' : 'width: 0px;'">
			<SideBarParticipants />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import Postit from './Postit.vue';
import SideBarParticipants from '@/components/retrospective/utils/SideBarParticipants.vue'
import { computed } from 'vue';
import UserCursors from './utils/UserCursors.vue';

const props = defineProps({
	optionTemplate: { type: Number, required: true}
})
const retroStore = useRetrospectiveStore();
const landPostit = computed(() => retroStore.tempMovingPostit);
const postitsInCurrentRetro = computed(() => retroStore.currentRetro.postits);
const showSideBar = computed(() => retroStore.isSideBar)


const dropPostit = (typedBoard: number) => {
	// TODO: ENUM
	retroStore.addPostitToBoard(typedBoard, landPostit.value);
};

</script>
