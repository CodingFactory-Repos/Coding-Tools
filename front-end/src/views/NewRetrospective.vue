<template>
	<div class="flex flex-col h-full">
		<div class="flex relative justify-center items-center mb-2 mt-2 h-40">
			<div class="text-black w-fit  absolute left-16">
				<h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{title}}</h2>
			</div>
			<div class="flex items-center gap-2">
				<Timer />
			</div>
		</div>
		<div>
			<div class="w-full bg-slate-300">
				<NavInfosRetro />
			</div>
		</div>
		<div class="h-full" v-if="optionTemplate">
			<Board :optionTemplate="optionTemplate" />
			<div class="text-black">
			</div>
		</div>
		<div
			class="privateSection h-full bg-slate-500 flex items-center justify-center flex-wrap overflow-y-scroll gap-6 p-4"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit()"
		>
			<PrivateSection />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, onUnmounted, onMounted } from 'vue';
import Board from '@/components/retrospective/Board.vue';
import Timer from '@/components/retrospective/Timer.vue';
import PrivateSection from '@/components/retrospective/PrivateSection.vue'
import NavInfosRetro from '@/components/retrospective/utils/NavInfosRetro.vue'
import { useRoute } from 'vue-router';
import { socketRetro, useSocket } from '@/composables/useSocketRetro';

const route = useRoute();
const retrospectiveStore = useRetrospectiveStore();
const title = computed(() => retrospectiveStore.currentRetro.title);
const optionTemplate = computed(() => retrospectiveStore.currentRetro.optionTemplate);
const tempPostit = computed(() => retrospectiveStore.tempMovingPostit)
const isRetroEnded = computed(() => retrospectiveStore.currentRetro.isRetroEnded)


const dropPostit = () => {
	retrospectiveStore.setPostitToPriv(tempPostit.value);

}

onMounted(async () => {
	if (route.params.id)
		retrospectiveStore.getCurrentRetro(route.params.id as string);

	useSocket(route.params.id as string);
})

onUnmounted(() => {
	socketRetro.socket.disconnect();
});

</script>

<style lang="scss">

.privateSection {
	z-index: 10;
}
</style>
