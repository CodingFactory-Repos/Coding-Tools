<template>
	<ModalOverlay v-if="showPersonaModal" @close="beforeModalClose" size="full">
		<template #header>
			<div class="flex items-center gap-3 w-full pr-10 pb-3">
				<span class="text-lg font-bold text-black dark:text-white">Build your persona</span>
				<div class="h-3 relative w-52 rounded-full overflow-hidden">
					<div class="w-full h-full bg-gray-200 absolute"></div>
					<div id="bar" class="h-full bg-[#973e85] relative transition-all" :style="{ 'width': percentage + '%' }"></div>
				</div>
			</div>
		</template>
		<template #body>
			<div class="flex justify-center items-center w-full overflow-y-scroll gap-4 pt-6 px-3">
				<PersonaBuilderProfile
					v-if="state === 0"
					@unmounted="onBuilderStep"
					:profile="persona.profile"
				/>
				<PersonaBuilderGoalAndNeed
					v-else-if="state === 1"
					@unmounted="onBuilderStep"
					:goals="persona.goals"
					:needs="persona.needs"
				/>
				<BuilderChallengesAndDifficulties
					v-else-if="state === 2"
					@unmounted="onBuilderStep"
					:difficulties="persona.difficulties"
					:challenges="persona.challenges"
				/>
				<BuilderSkillsAndCommentary
					v-else-if="state === 3"
					@unmounted="onBuilderStep"
					:skills="persona.skills"
					:commentary="persona.commentary"
				/>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-center items-center w-full overflow-y-scroll gap-4">
				<DefaultButton
					v-if="state > 0"
					type="button"
					text="Previous"
					text-style="text-white hover:text-white"
					background="bg-dark-secondary w-24"
					@click="previous"
				/>
				<DefaultButton
					v-if="state + 1 < steps"
					type="button"
					text="Next"
					color="text-white hover:text-white"
					text-style="text-white hover:text-white"
					background="bg-dark-secondary w-24"
					@click="next"
				/>
				<DefaultButton
					v-if="state +1 === steps"
					type="button"
					text="Create the persona"
					color="text-white hover:text-white"
					text-style="text-white hover:text-white"
					background="bg-[#973e85]"
					@click="finishPersona('personas')"
				/>
			</div>
		</template>
	</ModalOverlay>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';

import ModalOverlay from '@/components/common/Modal.vue';
import { LitteralBlueprintTypes } from '@/store/interfaces/agility.interface';
import { useProjectStore } from '@/store/modules/project.store';
import PersonaBuilderProfile from '@/components/agility/persona/BuilderProfile.vue';
import PersonaBuilderGoalAndNeed from '@/components/agility/persona/BuilderGoalAndNeed.vue';
import BuilderChallengesAndDifficulties from '@/components/agility/persona/BuilderChallengesAndDifficulties.vue';
import BuilderSkillsAndCommentary from '@/components/agility/persona/BuilderSkillsAndCommentary.vue';
import DefaultButton from '@/components/common/buttons/Default.vue';
import { PersonaBuilder } from '@/lib/pixi-tools-v2/blueprint/personas';
import { DeepPartial } from '@/interfaces/advanced-types.interface';

const persona = reactive<DeepPartial<PersonaBuilder>>({
	profile: {},
	goals: [],
	needs: [],
	difficulties: [],
	challenges: [],
	skills: '',
	commentary: '',
})

const emit = defineEmits(['close']);
const projectStore = useProjectStore();
const showPersonaModal = ref(false);
const state = ref(0);
const steps = ref(4);
const percentage = computed(() => (state.value / steps.value) * 100);

const openPersonaModal = () => showPersonaModal.value = true;
const closePersonaModal = () => showPersonaModal.value = false;

const beforeModalClose = () => {
	closePersonaModal();
	emit("close");
}

const finishPersona = (type: LitteralBlueprintTypes) => {
	projectStore.personaBuilder = persona;
	projectStore.deferredBlueprint = type;
	projectStore.setBlueprintEvent('pointer');
	closePersonaModal();
	emit("close");
}

const next = () => { state.value++ };
const previous = () => { state.value-- };

const onBuilderStep = (data: Partial<PersonaBuilder>) => {
	if(data.profile) persona.profile = data.profile;
	if(data.goals) persona.goals = data.goals;
	if(data.needs) persona.needs = data.needs;
	if(data.skills) persona.skills = data.skills;
	if(data.difficulties) persona.difficulties = data.difficulties;
	if(data.challenges) persona.challenges = data.challenges;
	if(data.commentary) persona.commentary = data.commentary;
}

openPersonaModal();
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.25s ease-out;
}

.slide-up-enter-from {
	opacity: 0;
	transform: translateY(30px);
}

.slide-up-leave-to {
	opacity: 0;
	transform: translateY(-30px);
}
</style>