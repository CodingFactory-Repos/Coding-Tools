<template>
	<div class="flex flex-col gap-4 w-2/3 h-full items-start justify-start overflow-y-scroll max-h-[550px]">
		<div class="flex flex-col gap-4 w-full">
			<h2 class="w-full text-center text-xl font-bold">Persona skills</h2>
			<FormField
				v-for="(value, index) in skillsBuilder"
				:limit="true"
				:char-limit="80"
				:char-number="value.length"
				:key="`goals_${index}`"
			>
				<input
					maxlength="80"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
					@input="(e) => writeSkill(e, index)"
				/>
			</FormField>
			<div @click="addNewSkill"
				class="cursor-pointer flex gap-3 justify-center items-center bg-transparent w-full outline-none border border-[#6B7280] hover:border-[#1C64F2] number-border py-1.5 px-2 rounded text-black dark:text-white border-dashed"
			>
				<SvgAdd class="!fill-white" width="20" height="20"/> Add a new skill
			</div>
		</div>


		<div class="flex flex-col gap-4 w-full">
			<FormField
				label="Additional commentary"
				:limit="true"
				:char-limit="200"
				:char-number="commentary.length"
			>
				<textarea
					v-model.trim="commentary"
					class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
					rows="3"
					maxlength="200"
				></textarea>
			</FormField>
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
	skills: Partial<PersonaBuilder["skills"]>
	commentary: Partial<PersonaBuilder["commentary"]>
}>();

const skillsBuilder = ref(props.skills ?? ['']);
const commentary = ref(props.commentary ?? '');

const addNewSkill = () => {
	skillsBuilder.value.push('');
}

const writeSkill = (e: Event, index: number) => {
	const target = e.target as HTMLInputElement;
	skillsBuilder.value[index] = target.value?.trim();
}

onUnmounted(() => {
	const sanitizedSkills = skillsBuilder.value.filter((data) => data !== '' && data !== undefined);

	emits('unmounted', {
		skills: sanitizedSkills,
		commentary: commentary.value,
	});
})
</script>