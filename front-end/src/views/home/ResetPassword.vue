<template>
	<div class="grid w-full h-full content-center justify-items-center flex-col" style="--s: 1rem">
		<div class="flex-col" style="--s: 1rem">
			<h2 class="text-4xl font-bold">Reset your password</h2>
			<p>
				Please enter your new password, it will take effect right away and you'll be redirected.
			</p>
		</div>
		<div class="p-2 space-y-4 md:space-y-6 sm:p-8 w-4/12">
			<form class="w-full space-y-4 md:space-y-6" @submit.prevent="sendResetPasswordEmail">
				<div class="w-full">
					<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Your Password</label
					>
					<input
						v-model="password"
						type="password"
						name="password"
						id="email"
						class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="name@company.com"
						:required="true"
					/>
				</div>
				<button
					type="submit"
					class="text-white hover:text-white gradiant font-bold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
				>
					Submit
				</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/modules/auth.store';
import { isEmpty } from '@/utils/helpers/string.helper';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const password = ref('');
const token = route.params.token as string;

const sendResetPasswordEmail = async () => {
	if (isEmpty(password.value)) return;

	const redirect = await authStore.tryResetPassword(password.value, token);
	if (redirect) router.push('/home/signin');
};
</script>
