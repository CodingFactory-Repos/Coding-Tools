<template>
	<div class="flex flex-col justify-center items-center w-full">
		<div class="flex flex-col gap-3 mb-2">
			<h1 class="text-2xl font-extrabold leading-tight tracking-tight text-white">Tell us about yourself</h1>
			<span class="text-lg font-light text-gray-300">Are you a student or a product owner ?</span>
		</div>
		<div class="flex flex-col gap-5 mb-4 w-full max-w-md">
			<div class="flex w-full">
				<input
					v-model="picked"
					type="radio"
					id="student"
					name="student"
					:value="1"
					class="hidden peer"
					required
				>
				<label for="student"
					class="flex relative w-full cursor-pointer bg-white hover:bg-gray-200 rounded-lg justify-center items-center"
				>
					<ButtonDefault
						type="submit"
						text="I'm a student"
						class="w-full pointer-events-none"
						text-style="text-gray-700 font-bold text-sm"
					/>
					<SvgRoundCheck
						v-if="picked === 1"
						class="absolute right-2 fill-green-500"
					/>
				</label>
			</div>
			<div class="flex w-full">
				<input
					v-model="picked"
					type="radio"
					id="product_owner"
					name="product_owner"
					:value="2"
					class="hidden peer"
				>
				<label for="product_owner"
					class="flex relative w-full cursor-pointer bg-white hover:bg-gray-200 rounded-lg justify-center items-center"
				>
					<ButtonDefault
						type="submit"
						text="I'm a product owner"
						class="w-full pointer-events-none pointer"
						text-style="text-gray-700 font-bold text-sm"
					/>
					<SvgRoundCheck
						v-if="picked === 2"
						class="absolute right-2 fill-green-500"
					/>
				</label>
			</div>
			<ButtonDefault
				@click="$emit('nextStep', 1)"
				text="Next: Account Info"
				class="w-full"
				:class="{ 'cursor-not-allowed': !canNextStep, 'gradiant': canNextStep }"
				text-style="text-white font-bold text-sm"
				background="bg-white"
				:disabled="!canNextStep"
			/>
		</div>
		<p class="text-sm font-light text-white">
			Already have an account ?
			<RouterLink to="/signin" class="font-medium text-white hover:underline dark:text-white underline">
				Sign in
			</RouterLink>
		</p>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import ButtonDefault from '@/components/common/buttons/Default.vue';
import SvgRoundCheck from '@/components/common/svg/RoundCheck.vue';

const authStore = useAuthStore();
const canNextStep = ref(false);
const picked = ref();

// Necessary if the user goes from step 2 to step 1
onMounted(() => {
	if (authStore.tempAuthUser.role !== undefined) {
		picked.value = authStore.tempAuthUser.role
	}
})

watch(picked, value => {
	if (value) {
		canNextStep.value = true;
		authStore.tempAuthUser.role = value
	}
})
</script>