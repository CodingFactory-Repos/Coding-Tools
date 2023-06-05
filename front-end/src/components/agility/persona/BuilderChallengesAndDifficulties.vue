<template>
	<div class="flex flex-row gap-4 w-2/3 h-full items-start justify-start overflow-y-scroll max-h-[550px]">
		<div class="flex flex-col gap-4 w-full">
			<h2 class="w-full text-center text-xl font-bold">Persona skills</h2>
			<FormField
				v-for="(value, index) in challengesBuilder"
				:limit="true"
				:char-limit="80"
				:char-number="value.length"
				:key="`goals_${index}`"
			>
				<input
					maxlength="80"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					@input="(e) => writeChallenge(e, index)"
				/>
			</FormField>
			<div @click="addNewChallenge"
				class="cursor-pointer flex gap-3 justify-center items-center bg-transparent w-full outline-none border border-[#6B7280] hover:border-[#1C64F2] number-border py-1.5 px-2 rounded text-black dark:text-white border-dashed"
			>
				<SvgAdd class="!fill-white" width="20" height="20"/> Add a new challenge
			</div>
		</div>
		<div class="flex flex-col gap-4 w-full">
			<h2 class="w-full text-center text-xl font-bold">Persona difficulties</h2>
			<FormField
				v-for="(value, index) in difficultiesBuilder"
				:limit="true"
				:char-limit="80"
				:char-number="value.length"
				:key="`needs_${index}`"
			>
				<input
					maxlength="80"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					@input="(e) => writeDifficulty(e, index)"
				/>
			</FormField>
			<div @click="addNewDifficulty"
				class="cursor-pointer flex gap-3 justify-center items-center bg-transparent w-full outline-none border border-[#6B7280] hover:border-[#1C64F2] number-border py-1.5 px-2 rounded text-black dark:text-white border-dashed"
			>
				<SvgAdd class="!fill-white" width="20" height="20"/> Add a new difficulty
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
	challenges: Partial<PersonaBuilder["challenges"]>
	difficulties: Partial<PersonaBuilder["difficulties"]>
}>();

const challengesBuilder = ref(props.challenges ?? ['']);
const difficultiesBuilder = ref(props.difficulties ?? ['']);

const addNewChallenge = () => {
	challengesBuilder.value.push('');
}

const addNewDifficulty = () => {
	difficultiesBuilder.value.push('');
}

const writeChallenge = (e: Event, index: number) => {
	const target = e.target as HTMLInputElement;
	challengesBuilder.value[index] = target.value?.trim();
}

const writeDifficulty = (e: Event, index: number) => {
	const target = e.target as HTMLInputElement;
	difficultiesBuilder.value[index] = target.value?.trim();
}

onUnmounted(() => {
	const sanitizedChallenges = challengesBuilder.value.filter((data) => data !== '' && data !== undefined);
	const sanitizedDifficulties = difficultiesBuilder.value.filter((data) => data !== '' && data !== undefined);

	emits('unmounted', {
		skills: sanitizedChallenges,
		difficulties: sanitizedDifficulties
	});
})
</script>