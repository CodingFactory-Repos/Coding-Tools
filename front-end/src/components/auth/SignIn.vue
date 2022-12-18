<template>
	<section>
		<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
			<div
				class="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700"
			>
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1
						class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
					>
						Sign in to your account
					</h1>
					<form class="space-y-4 md:space-y-6" @submit.prevent="trySubmit">
						<div>
							<label
								for="email"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Your email</label
							>
							<input
								v-model="signin.email"
								type="email"
								name="email"
								id="email"
								class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="name@company.com"
								:required="true"
							/>
						</div>
						<div>
							<label
								for="password"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Password</label
							>
							<input
								v-model="signin.password"
								type="password"
								name="password"
								id="password"
								placeholder="••••••••"
								class="bg-gray-50 outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								r:required="true"
							/>
						</div>
						<div class="flex items-center justify-between">
							<RouterLink
								to="/home/ask-reset"
								class="text-sm font-medium hover:underline text-gray-900 dark:text-white"
								>Forgot password?</RouterLink
							>
						</div>
						<button
							class="gradiant text-white font-bold py-2 px-4 rounded-lg focus:ring-4 focus:outline-none focus:ring-primary-300"
						>
							Log me in
						</button>
						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							Don't have an account yet?
							<RouterLink
								to="/home/signup"
								class="font-medium text-primary-600 hover:underline text-sky-800 dark:text-primary-500"
								>Sign up</RouterLink
							>
						</p>
					</form>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { isEmpty } from '@/utils/helpers/string.helper';
import { defineComponent, reactive } from 'vue';

import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';

export default defineComponent({
	setup() {
		const authStore = useAuthStore();
		const router = useRouter();

		const defaultReactive = {
			password: '',
			email: '',
		};

		const error = reactive(defaultReactive);
		const signin = reactive(defaultReactive);

		const trySubmit = async () => {
			let isValid = true;

			if (isEmpty(signin.email)) {
				error.email = 'email is invalid';
				isValid = false;
			}

			if (isEmpty(signin.password)) {
				error.password = 'password is invalid';
				isValid = false;
			}

			if (!isValid) return;

			error.email = defaultReactive.email;
			error.password = defaultReactive.password;
			const redirect = await authStore.trySignin(signin);
			if (redirect) {
				router.push('/');
			}
		};

		return {
			trySubmit,
			isEmpty,
			signin,
			error,
		};
	},
});
</script>

<style>
form {
	display: flex;
	flex-direction: column;
	width: 500px;
}
</style>
