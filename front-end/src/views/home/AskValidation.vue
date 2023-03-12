<template>
	<div class="grid w-full h-full content-center justify-items-center flex-col" style="--s: 3rem">
		<div class="flex-col" style="--s: 1rem">
			<h2 class="text-4xl font-bold">Welcome to Coding Tools !</h2>
			<h4 class="text-xl font-bold">An email was sent to your mailbox to validate your account.</h4>
		</div>
		<div class="flex-col" style="--s: 1rem">
			<p>If you did not receive the email, check the spam or click on the below button</p>
			<button
				@click="sendNewActivationEmail"
				class="text-white hover:text-white gradiant font-bold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
			>
				Send another validation email
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth.store';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const email = route.params.email as string;

const sendNewActivationEmail = () => {
	authStore.trySendNewActivationEmail(email);
};
</script>
