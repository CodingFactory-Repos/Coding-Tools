<template>
	<div class="flex flex-col gap-4 w-2/3 h-full items-start justify-start overflow-y-scroll max-h-[550px]">
		<div class="flex flex-col gap-4 w-full">
			<FormField
				label="What are the skills of the persona ?"
				:limit="true"
				:char-limit="300"
				:char-number="refSkills.length"
			>
				<textarea
					v-model.trim="refSkills"
					class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
					rows="4"
					maxlength="300"
				></textarea>
			</FormField>
		</div>

		<div class="flex flex-col gap-4 w-full">
			<FormField
				label="Additional commentary"
				:limit="true"
				:char-limit="300"
				:char-number="refCommentary.length"
			>
				<textarea
					v-model.trim="refCommentary"
					class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
					rows="4"
					maxlength="300"
				></textarea>
			</FormField>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import FormField from '@/components/common/FormField.vue';
import { PersonaBuilder } from '@/lib/pixi-tools-v2/blueprint/personas';

const emits = defineEmits<{
	(e: 'unmounted', builder: Partial<PersonaBuilder>)
}>();

const props = defineProps<{
	skills: Partial<PersonaBuilder["skills"]>
	commentary: Partial<PersonaBuilder["commentary"]>
}>();

const refSkills = ref(props.skills ?? '');
const refCommentary = ref(props.commentary ?? '');

onUnmounted(() => {
	emits('unmounted', {
		skills: refSkills.value,
		commentary: refCommentary.value,
	});
})
</script>