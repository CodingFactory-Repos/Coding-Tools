<template>
	<div class="flex flex-col h-full">
		<div class="flex">
			<div class="text-black w-full">
				Title of the retro
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
			<Board />
		</div>
		<div class="h-full bg-slate-500">
			<div class="text-black">
				board to edit
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent } from 'vue';
import Board from '@/components/retrospective/Board.vue';
import Timer from '@/components/retrospective/Timer.vue';

export default defineComponent({
	components: {
    Board,
    Timer
},
	setup() {
		const retrospectiveStore = useRetrospectiveStore();
	},
});
</script>
