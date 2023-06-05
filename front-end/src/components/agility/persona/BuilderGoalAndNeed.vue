<template>
	<div class="flex flex-row gap-4 w-2/3 h-full items-start justify-start overflow-y-scroll max-h-[550px]">
		<div class="flex flex-col gap-4 w-full">
			<h2 class="w-full text-center text-xl font-bold">Persona goals</h2>
			<FormField
				v-for="(value, index) in goalsBuilder"
				:limit="true"
				:char-limit="80"
				:char-number="value.length"
				:key="`goals_${index}`"
			>
				<input
					maxlength="80"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					@input="(e) => writeGoal(e, index)"
				/>
			</FormField>
			<div @click="addNewGoal"
				class="cursor-pointer flex gap-3 justify-center items-center bg-transparent w-full outline-none border border-[#6B7280] hover:border-[#1C64F2] number-border py-1.5 px-2 rounded text-black dark:text-white border-dashed"
			>
				<SvgAdd class="!fill-white" width="20" height="20"/> Add a new goal
			</div>
		</div>
		<div class="flex flex-col gap-4 w-full">
			<h2 class="w-full text-center text-xl font-bold">Persona needs</h2>
			<FormField
				v-for="(value, index) in needsBuilder"
				:limit="true"
				:char-limit="80"
				:char-number="value.length"
				:key="`needs_${index}`"
			>
				<input
					maxlength="80"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					@input="(e) => writeNeed(e, index)"
				/>
			</FormField>
			<div @click="addNewNeed"
				class="cursor-pointer flex gap-3 justify-center items-center bg-transparent w-full outline-none border border-[#6B7280] hover:border-[#1C64F2] number-border py-1.5 px-2 rounded text-black dark:text-white border-dashed"
			>
				<SvgAdd class="!fill-white" width="20" height="20"/> Add a new need
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import FormField from '@/components/common/FormField.vue';
import { PersonaBuilder } from '@/components/agility/modals/Persona.vue';
import SvgAdd from '@/components/common/svg/Add.vue';

const emits = defineEmits<{
	(e: 'unmounted', builder: Partial<PersonaBuilder>)
}>();

const props = defineProps<{
	goals: Partial<PersonaBuilder["goals"]>
	needs: Partial<PersonaBuilder["needs"]>
}>();

const goalsBuilder = ref(props.goals ?? ['']);
const needsBuilder = ref(props.needs ?? ['']);

const addNewGoal = () => {
	goalsBuilder.value.push('');
}

const addNewNeed = () => {
	needsBuilder.value.push('');
}

const writeGoal = (e: Event, index: number) => {
	const target = e.target as HTMLInputElement;
	goalsBuilder.value[index] = target.value?.trim();
}

const writeNeed = (e: Event, index: number) => {
	const target = e.target as HTMLInputElement;
	needsBuilder.value[index] = target.value?.trim();
}

onUnmounted(() => {
	const sanitizedGoals = goalsBuilder.value.filter((data) => data !== '' && data !== undefined);
	const sanitizedNeeds = needsBuilder.value.filter((data) => data !== '' && data !== undefined);

	emits('unmounted', {
		goals: sanitizedGoals,
		needs: sanitizedNeeds
	});
})
</script>