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
			class="h-full bg-slate-500 flex items-center justify-center flex-wrap overflow-y-scroll gap-4 p-4"
			@dragenter.prevent
			@dragover.prevent
			@drop="dropPostit(4)"
		>
			<PrivateSection />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { computed, defineComponent } from 'vue';
import Board from '@/components/retrospective/Board.vue';
import Timer from '@/components/retrospective/Timer.vue';
import PrivateSection from '@/components/retrospective/PrivateSection.vue'

const retrospectiveStore = useRetrospectiveStore();
const title = computed(() => retrospectiveStore.titleNewRetro);
const optionTemplate = computed(() => retrospectiveStore.optionTemplate);
const tempPostit = computed(() => retrospectiveStore.tempMovingPostit)


const dropPostit = () => {
	retrospectiveStore.setPostitToPriv(tempPostit.value);

}
</script>
