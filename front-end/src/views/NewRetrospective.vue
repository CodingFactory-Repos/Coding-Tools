<template>
	<div class="flex flex-col h-full">
		<div class="flex">
			<div class="text-black w-full">
				{{title}}
			</div>
			<div class="w-full">
				<Timer />
			</div>
		</div>
		<div>
			<div class="w-full bg-slate-300">
				Navigation informations
			</div>
		</div>
		<div class="h-full">
			<Board :optionTemplate="optionTemplate" />
		</div>
		<div
			class="h-full bg-slate-500 flex items-center justify-center flex-wrap overflow-y-scroll gap-6 p-4"
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
import { computed, onUnmounted } from 'vue';
import Board from '@/components/retrospective/Board.vue';
import Timer from '@/components/retrospective/Timer.vue';
import PrivateSection from '@/components/retrospective/PrivateSection.vue'
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { socketRetro, useSocket } from '@/composables/useSocketRetro';

const route = useRoute();
const retrospectiveStore = useRetrospectiveStore();
const title = computed(() => retrospectiveStore.currentRetro.title);
const optionTemplate = computed(() => retrospectiveStore.currentRetro.optionTemplate);
const tempPostit = computed(() => retrospectiveStore.tempMovingPostit)


const dropPostit = () => {
	retrospectiveStore.setPostitToPriv(tempPostit.value);

}

onMounted(async () => {
	if (route.params.id)
		retrospectiveStore.getCurrentRetro(route.params.id as string);

	useSocket(route.params.id);
})

onUnmounted(() => {
	socketRetro.socket.disconnect();
});



</script>
