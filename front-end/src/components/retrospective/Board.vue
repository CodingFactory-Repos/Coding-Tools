<template>
	<!-- TODO: Rework the board creation -->
		<div class="border-solid border-2 border-sky-300 flex min-h-[36rem] max-h-[38rem] ">
			<div class="border-solid border-2 border-sky-500 flex flex-col flex-1 gap-2 ">
				<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-if="props.optionTemplate === 1">
					<h3>Mad</h3>
				</div>
				<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-else>
					<h3>Liked</h3>
				</div>
				<div class="text-black bg-slate-300 flex flex-wrap  gap-2 items-start justify-center content-start overflow-y-scroll">
					<Postit />
					<Postit />
				</div>
			</div>
			<div class="border-solid border-2 border-sky-500 flex flex-col flex-1 gap-2 ">
				<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-if="props.optionTemplate === 1">
					<h3>Sad</h3>
				</div>
				<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-else>
					<h3>Learned</h3>
				</div>
				<div class="text-black bg-slate-300 flex flex-wrap  gap-2 items-start justify-center content-start overflow-y-scroll">
					<Postit />
				</div>
			</div>
			<div class="border-solid border-2 border-sky-500 flex flex-col flex-1 gap-2 ">
				<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-if="props.optionTemplate === 1">
					<h3>Glad</h3>
				</div>
				<div class="text-black flex justify-center bg-slate-500 border-b-2 border-slate-700" v-else>
					<h3>Lacked</h3>
				</div>
				<div class="text-black bg-slate-300 flex flex-wrap  gap-2 items-start justify-center content-start overflow-y-scroll">
					<Postit />
				</div>
			</div>

		</div>
</template>

<script lang="ts" setup>
import Postit from './Postit.vue';

const props = defineProps({
	optionTemplate: { type: Number, required: true}
})

</script>
