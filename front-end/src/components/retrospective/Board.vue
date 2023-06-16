<template>
	<!-- TODO: Rework the board creation -->
	<div
		class="border-solid border border-gray-400 dark:border-slate-700 flex min-h-[26rem] max-h-[28rem]"
		v-if="postitsInCurrentRetro"
	>
		<div
			class="border-solid border border-gray-400 dark:border-slate-700 flex flex-col flex-1 bg-slate-50 dark:bg-slate-400"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(1)"
		>
			<div class="text-black flex justify-center bg-slate-50 border-b-2 border-slate-100 p-1 dark:bg-slate-500 dark:border-slate-600"
				v-if="props.optionTemplate === 1">
				<h3 class="text-[#353A39] text-l font-bold dark:text-white">Mad</h3>
			</div>
			<div class="text-black flex justify-center bg-slate-50 border-b-2 border-slate-100 p-1" v-else>
				<h3 class="text-[#353A39] text-l font-bold dark:text-white">Liked</h3>
			</div>
			<div
				class="text-black flex flex-wrap gap-6 items-start justify-center content-start overflow-y-scroll pt-6 pb-6">
				<Postit v-for="postit in postitsInCurrentRetro[1]" :postit="postit" />
			</div>
		</div>
		<div
			class="border-solid border border-gray-400 dark:border-slate-700 flex flex-col flex-1 bg-slate-50 dark:bg-slate-400"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(2)"
		>
			<div class="text-black flex justify-center bg-slate-50 border-b-2 border-slate-100 p-1 dark:bg-slate-500 dark:border-slate-600"
				v-if="props.optionTemplate === 1">
				<h3 class="text-[#353A39] text-l font-bold dark:text-white">Sad</h3>
			</div>
			<div class="text-black flex justify-center bg-slate-50 border-b-2 border-slate-100 p-1" v-else>
				<h3 class="text-[#353A39] text-l font-bold dark:text-white">Learned</h3>
			</div>
			<div
				class="text-black flex flex-wrap gap-6 items-start justify-center content-start overflow-y-scroll pt-6 pb-6">
				<Postit v-for="postit in postitsInCurrentRetro[2]" :postit="postit" />
			</div>
		</div>
		<div
			class="border-solid border border-gray-400 dark:border-slate-700 flex flex-col flex-1 bg-slate-50 dark:bg-slate-400"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(3)"
		>
			<div class="text-black flex justify-center bg-slate-50 border-b-2 border-slate-100 dark:bg-slate-500 dark:border-slate-600"
				v-if="props.optionTemplate === 1">
				<h3 class="text-[#353A39] text-l font-bold dark:text-white p-1 ">Glad</h3>
			</div>
			<div class="flex justify-center bg-slate-50 border-b-2 border-slate-100 p-1" v-else>
				<h3 class="text-[#353A39] text-l font-bold dark:text-white">Lacked</h3>
			</div>
			<div
				class="text-black flex flex-wrap gap-6 items-start justify-center content-start pt-6 pb-6 overflow-y-scroll">
				<Postit :postit="postit" v-for="postit in postitsInCurrentRetro[3]" />
			</div>
		</div>
		<UserCursors />
		<div class="h-full bg-light-secondary dark:bg-dark-tertiary duration-200 transition-width pointer-events-auto z-10"
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
