<template>
	<div class="flex flex-col gap-4 w-2/3 h-full">
		<div class="flex gap-5">
			<FormField
				label="Name of your persona"
				:limit="true"
				:char-limit="40"
				:char-number="personaBuilder.name.length"
			>
				<input
					v-model.trim="personaBuilder.name"
					maxlength="40"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
				/>
			</FormField>
			<FormField
				label="How old are they ?"
				:limit="true"
				:char-limit="3"
				:char-number="personaBuilder.age.length"
			>
				<input
					v-model.trim="personaBuilder.age"
					maxlength="3"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
				/>
			</FormField>
		</div>
		<div class="flex gap-5">
			<FormField
				label="What is their professional background ?"
				:limit="true"
				:char-limit="50"
				:char-number="personaBuilder.professionalBackground.length"
			>
				<input
					v-model.trim="personaBuilder.professionalBackground"
					maxlength="50"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
				/>
			</FormField>
			<FormField
				label="What is their personal situation ? (handicap, relationship, ...)"
				:limit="true"
				:char-limit="50"
				:char-number="personaBuilder.personalSituation.length"
			>
				<input
					v-model.trim="personaBuilder.personalSituation"
					maxlength="50"
					class="bg-transparent w-full outline-none border border-[#6B7280] number-border py-1.5 px-2 rounded text-black dark:text-white"
				/>
			</FormField>
		</div>
		<div class="flex gap-5">
			<FormField
				label="What motivate them ?"
				:limit="true"
				:char-limit="200"
				:char-number="personaBuilder.motivation.length"
			>
				<textarea
					v-model.trim="personaBuilder.motivation"
					class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
					rows="3"
					maxlength="200"
				></textarea>
			</FormField>
			<FormField
				label="Verbatism of the persona"
				:limit="true"
				:char-limit="125"
				:char-number="personaBuilder.verbatism.length"
			>
				<textarea
					v-model.trim="personaBuilder.verbatism"
					class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
					rows="3"
					maxlength="125"
				></textarea>
			</FormField>
		</div>
		<div class="flex gap-5">
			<FormField
				label="Persona bio"
				:limit="true"
				:char-limit="300"
				:char-number="personaBuilder.bio.length"
			>
				<textarea
					v-model.trim="personaBuilder.bio"
					class="bg-transparent w-full outline-none shadow-none ring-offset-0 focus:ring-0 resize-none rounded text-black dark:text-white"
					rows="3"
					maxlength="300"
				></textarea>
			</FormField>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, onUnmounted } from 'vue';
import FormField from '@/components/common/FormField.vue';
import { PersonaBuilder } from '@/lib/pixi-tools-v2/blueprint/personas';

const emits = defineEmits<{
	(e: 'unmounted', builder: Partial<PersonaBuilder>)
}>();

const props = defineProps<{
	profile: Partial<PersonaBuilder["profile"]>
}>();

const personaBuilder = reactive({
	name: props.profile.name ?? '',
	age:  props.profile.age ?? '',
	professionalBackground: props.profile.professionalBackground ?? '',
	personalSituation: props.profile.personalSituation ?? '',
	motivation: props.profile.motivation ?? '',
	bio: props.profile.bio ?? '',
	verbatism: props.profile.verbatism ?? '',
})

onUnmounted(() => {
	emits('unmounted', { profile: personaBuilder });
})
</script>