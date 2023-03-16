<template>
	<main class="flex w-full custom-background">
		<div class="w-full flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
			<div class="w-full rounded-lg dark:bg-dark-mode-primary shadow-lg md:mt-0 sm:max-w-2xl xl:p-0 glassmorphism">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<ProgressHeader :state="state"/>
					<div class="lg:flex h-full">
						<AskProfileInfo @nextStep="nextStep" v-if="state === 0" />
						<AskAccountInfo @nextStep="nextStep" v-else-if="state === 1" />
						<CodeVerification @nextStep="nextStep" v-else-if="state === 2" />
						<SuccessVerified v-else />
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import ProgressHeader from '@/components/auth/signup/ProgressHeader.vue';
import AskProfileInfo from '@/components/auth/signup/AskProfileInfo.vue';
import AskAccountInfo from '@/components/auth/signup/AskAccountInfo.vue';
import CodeVerification from '@/components/auth/signup/CodeVerification.vue';
import SuccessVerified from '@/components/auth/signup/SuccessVerified.vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth.store';

const state = ref(0);

const nextStep = (newState: number) => {
	state.value = newState
}

onBeforeRouteLeave(() => {
	const authStore = useAuthStore();
	authStore.tempAuthUser = {};
	authStore.tempEmailUser = "";
})
</script>